import { useMemo, useState, useCallback, useEffect } from "react";
import { Vim } from "@replit/codemirror-vim";
import { EditorView } from "@codemirror/view";
import { useSlideContext } from "../context/slideContext";
import useExportFunctions from "@/hooks/useExportFunctions";

export function useEditor(
  codeMirrorRef: React.RefObject<any>,
  fileUploadRef: React.RefObject<{ triggerFileUpload: () => void } | null>,
) {
  const {
    markdownText,
    setMarkdownText,
    setCurrentSlide,
    setTotalSlidesNumber,
    setCurrentSlideText,
  } = useSlideContext();
  const { handleSaveAsSlides, handleDownloadMd, handlePreviewFullSlides } = useExportFunctions();

  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleMarkdownChange = useCallback(
    (value: string) => {
      setMarkdownText(value);
    },
    [setMarkdownText],
  );

  const triggerFileUpload = useCallback(() => {
    if (!fileUploadRef.current) return;
    fileUploadRef.current?.triggerFileUpload();
  }, [fileUploadRef]);

  const processEditorState = useCallback(() => {
    const view = codeMirrorRef.current?.view;
    if (!view) {
      setCurrentSlide(1);
      setTotalSlidesNumber(1);
      setCurrentSlideText("");
      return;
    }

    const doc = view.state.doc;
    const currentPos = view.state.selection.main.head;
    const cursorLineNumber = doc.lineAt(currentPos).number;

    let inCodeBlock = false;
    const headingRegex = /^#{1,2} /; // Corrected Regex: Only match H1 and H2
    const allHeadingLines: number[] = [];
    let headingsAboveCursor = 0;
    let slideStartLine = -1;

    for (let i = 1; i <= doc.lines; i++) {
      const line = doc.line(i);
      const lineText = line.text;

      if (lineText.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
      }

      const isHeading = !inCodeBlock && headingRegex.test(lineText);

      if (isHeading) {
        allHeadingLines.push(i);
        if (i <= cursorLineNumber) {
          headingsAboveCursor++;
          slideStartLine = i;
        }
      }
    }

    setTotalSlidesNumber(Math.max(allHeadingLines.length, 1));
    setCurrentSlide(Math.max(headingsAboveCursor, 1));
    
    if (slideStartLine === -1) {
      if (allHeadingLines.length > 0) {
        const firstHeadingLine = allHeadingLines;
        const nextHeadingLine = allHeadingLines.length > 1 ? allHeadingLines : doc.lines + 1;
        const slideStartPos = doc.line(firstHeadingLine).from;
        const slideEndPos = doc.line(nextHeadingLine - 1).to;
        setCurrentSlideText(doc.sliceString(slideStartPos, slideEndPos).trim());
      } else {
        setCurrentSlideText(doc.toString());
      }
      return;
    }
    
    const currentHeadingIndex = allHeadingLines.indexOf(slideStartLine);
    const nextHeadingLine = (currentHeadingIndex + 1 < allHeadingLines.length) 
        ? allHeadingLines[currentHeadingIndex + 1]
        : doc.lines + 1;

    const slideStartPos = doc.line(slideStartLine).from;
    const slideEndPos = doc.line(nextHeadingLine - 1).to;
    const currentSlideContent = doc.sliceString(slideStartPos, slideEndPos).trim();
    setCurrentSlideText(currentSlideContent);

  }, [codeMirrorRef, setCurrentSlide, setTotalSlidesNumber, setCurrentSlideText]);

  const editorUpdateListener = useMemo(
    () =>
      EditorView.updateListener.of((update) => {
        if (isEditorReady) {
          if (update.docChanged || update.selectionSet || !update.transactions.length) {
            processEditorState();
          }
        }
      }),
    [processEditorState, isEditorReady],
  );

  const focusCodeMirror = useCallback(() => {
    if (codeMirrorRef.current && codeMirrorRef.current.view) {
      codeMirrorRef.current.view.focus();
    }
  }, [codeMirrorRef]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        focusCodeMirror();
      }
      if (event.key === "i" || event.key === "Enter") {
        const activeElement = document.activeElement;
        const isEditorFocused = codeMirrorRef.current?.view?.hasFocus;
        if (
          !isEditorFocused &&
          activeElement &&
          activeElement.tagName !== "INPUT" &&
          activeElement.tagName !== "TEXTAREA"
        ) {
          event.preventDefault();
          focusCodeMirror();
        }
      } else if ((event.ctrlKey || event.metaKey) && event.key === "s" && !event.shiftKey) {
        event.preventDefault();
        handleDownloadMd();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "o") {
        event.preventDefault();
        triggerFileUpload();
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        handleSaveAsSlides();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusCodeMirror, codeMirrorRef, handleDownloadMd, triggerFileUpload, handleSaveAsSlides]);

  useEffect(() => {
    Vim.defineEx("write", "w", handleDownloadMd);
    Vim.defineEx("wslide", "ws", handleSaveAsSlides);
    Vim.defineEx("upload", "u", triggerFileUpload);
    Vim.defineEx("preview", "p", handlePreviewFullSlides);
  }, [handleDownloadMd, handleSaveAsSlides, triggerFileUpload, handlePreviewFullSlides]);

  return {
    markdownText,
    handleMarkdownChange,
    setIsEditorReady,
    editorUpdateListener,
    isEditorReady,
  };
}