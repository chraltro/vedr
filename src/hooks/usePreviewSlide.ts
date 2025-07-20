import { useState, useEffect } from "react";
import { useSlideContext } from "@/context/slideContext";
import {
  exportSingleSlideToHtmlbody,
  exportSingleSlideToHtml,
  generateFontSizesCss,
  generateThemeCss,
  fontFamilies, // Import fontFamilies
} from "@/utils/export-utils";
import { themes } from "@/utils/themes";

export function usePreviewSlide(iframeRef: React.RefObject<HTMLIFrameElement | null>) {
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const { currentSlide, slideLayoutOptions, currentSlideText, fontSizeMultiplier, activeTheme, activeFont } = // Get activeFont
    useSlideContext();
  const [ismarkdownEmpty, setIsMarkdownEmpty] = useState(true);
  useEffect(() => {
    if (currentSlideText != null) {
      setIsMarkdownEmpty(false);
    } else {
      setIsMarkdownEmpty(true);
    }
  }, [currentSlideText]);

  useEffect(() => {
    const generatePreview = async () => {
      const theme = themes[activeTheme as keyof typeof themes];
      const html = await exportSingleSlideToHtml(
        theme,
        fontSizeMultiplier,
        currentSlideText,
        currentSlide,
        slideLayoutOptions,
        activeFont, // Send activeFont
      );

      setPreviewHtml(html);
    };
    if (!ismarkdownEmpty) {
      generatePreview();
    }
  }, [ismarkdownEmpty]);

  useEffect(() => {
    const generatePreview = async () => {
      const html = await exportSingleSlideToHtmlbody(
        currentSlideText,
        currentSlide,
        slideLayoutOptions,
      );

      if (iframeRef.current) {
        if (iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: "body", data: html }, "*");
        }
      }
    };

    generatePreview();
  }, [currentSlideText, slideLayoutOptions]);

  useEffect(() => {
    const css = generateFontSizesCss(fontSizeMultiplier);
    if (iframeRef.current) {
      if (iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "fontSize",
            data: css,
          },
          "*",
        );
      }
    }
  }, [fontSizeMultiplier]);

  useEffect(() => {
    const theme = themes[activeTheme as keyof typeof themes];
    const css = generateThemeCss(theme, fontFamilies[activeFont as keyof typeof fontFamilies]); // Send activeFontFamily
    if (iframeRef.current) {
      if (iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "theme",
            data: css,
          },
          "*",
        );
      }
    }
  }, [activeTheme, activeFont]); // Add activeFont to dependencies

  useEffect(() => {
    const theme = themes[activeTheme as keyof typeof themes];
    const css = generateThemeCss(theme, fontFamilies[activeFont as keyof typeof fontFamilies]); // Generate CSS with current font
    if (iframeRef.current) {
      if (iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "fontFamily", // New message type for font family
            data: css, // Send the updated theme CSS, which includes the font-family variable
          },
          "*",
        );
      }
    }
  }, [activeFont, activeTheme]); // Trigger when activeFont or activeTheme changes

  return {
    previewHtml,
  };
}

