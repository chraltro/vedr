import { useState, useEffect, useRef } from "react";
import { useSlideContext } from "@/context/slideContext";
import {
  exportSingleSlideToHtml,
  exportSingleSlideToHtmlbody,
  generateFontSizesCss,
  generateThemeCss,
  fontFamilies,
} from "@/utils/export-utils";
import { themes } from "@/utils/themes";

export function usePreviewSlide(iframeRef: React.RefObject<HTMLIFrameElement | null>) {
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const {
    currentSlide,
    slideLayoutOptions,
    currentSlideText,
    fontSizeMultiplier,
    activeTheme,
    activeFont,
  } = useSlideContext();

  const channel = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    channel.current = new BroadcastChannel("md-presenter-channel");
    return () => {
      channel.current?.close();
    };
  }, []);

  useEffect(() => {
    const generateInitialPreview = async () => {
      setLoading(true);
      try {
        const theme = themes[activeTheme as keyof typeof themes];
        const html = await exportSingleSlideToHtml(
          theme,
          fontSizeMultiplier,
          currentSlideText || " ",
          currentSlide,
          slideLayoutOptions,
          activeFont,
        );
        setPreviewHtml(html);
      } catch (error) {
        console.error("Error generating initial preview HTML:", error);
        setPreviewHtml("<html><body>Error loading preview.</body></html>");
        setLoading(false);
      }
    };
    generateInitialPreview();
  }, []);

  useEffect(() => {
    if (loading) return;

    const updateFullPreview = async () => {
        const theme = themes[activeTheme as keyof typeof themes];
        const html = await exportSingleSlideToHtml(
          theme,
          fontSizeMultiplier,
          currentSlideText,
          currentSlide,
          slideLayoutOptions,
          activeFont,
        );
        // Post the *entire* new HTML document to the broadcast channel
        channel.current?.postMessage({ type: "fullUpdate", data: html });

        // Update the local iframe's srcDoc as before
        setPreviewHtml(html);
    };

    updateFullPreview();
  }, [currentSlideText, currentSlide, slideLayoutOptions, fontSizeMultiplier, activeTheme, activeFont, loading]);

  return {
    previewHtml,
    loading,
    setLoading,
  };
}