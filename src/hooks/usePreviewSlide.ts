import { useState, useEffect } from "react";
import { useSlideContext } from "@/context/slideContext";
import {
  exportSingleSlideToHtml,
  generateFontSizesCss,
  generateThemeCss,
  fontFamilies,
} from "@/utils/export-utils";
import { themes } from "@/utils/themes";

export function usePreviewSlide(iframeRef: React.RefObject<HTMLIFrameElement | null>) {
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [loading, setLoading] = useState(true); // State to control the loading overlay
  const { currentSlide, slideLayoutOptions, currentSlideText, fontSizeMultiplier, activeTheme, activeFont } =
    useSlideContext();

  // This effect generates the full HTML for the iframe's srcDoc
  useEffect(() => {
    const generateFullPreview = async () => {
      setLoading(true); // Show loading overlay
      try {
        const theme = themes[activeTheme as keyof typeof themes];
        const html = await exportSingleSlideToHtml(
          theme,
          fontSizeMultiplier,
          currentSlideText,
          currentSlide,
          slideLayoutOptions,
          activeFont,
        );
        setPreviewHtml(html);
      } catch (error) {
        console.error("Error generating full preview HTML:", error);
        // Fallback HTML in case of error
        setPreviewHtml("<html><body><p style='color:red;'>Error loading preview. Check console for details.</p></body></html>");
        setLoading(false); // Hide loading overlay even on error
      }
    };

    generateFullPreview();
  }, [currentSlideText, currentSlide, slideLayoutOptions, fontSizeMultiplier, activeTheme, activeFont]); // Depend on all relevant state

  // This effect sends font size updates via postMessage (if iframe is already loaded)
  // This is for performance, to avoid full iframe reload if only font size changes.
  useEffect(() => {
    const css = generateFontSizesCss(fontSizeMultiplier);
    if (iframeRef.current && iframeRef.current.contentWindow && previewHtml) { // Only send if iframe has content
      iframeRef.current.contentWindow.postMessage(
        {
          type: "fontSize",
          data: css,
        },
        "*",
      );
    }
  }, [fontSizeMultiplier, iframeRef, previewHtml]); // Add previewHtml to ensure iframe is ready

  // This effect sends theme (and thus font family) updates via postMessage
  useEffect(() => {
    const theme = themes[activeTheme as keyof typeof themes];
    const css = generateThemeCss(theme, fontFamilies[activeFont as keyof typeof fontFamilies]);
    if (iframeRef.current && iframeRef.current.contentWindow && previewHtml) { // Only send if iframe has content
      iframeRef.current.contentWindow.postMessage(
        {
          type: "theme", // This message type handles both theme and font-family CSS variables
          data: css,
        },
        "*",
      );
    }
  }, [activeTheme, activeFont, iframeRef, previewHtml]); // Add previewHtml to ensure iframe is ready

  return {
    previewHtml,
    loading, // Return loading state
    setLoading, // Return setLoading to be used by iframe's onLoad
  };
}
