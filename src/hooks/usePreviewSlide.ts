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

  const isIframeReady = useRef(false);

  // Effect to generate the full initial HTML for the iframe.
  // This runs only when the component mounts to create the iframe's structure.
  useEffect(() => {
    const generateInitialPreview = async () => {
      setLoading(true); // Start loading state
      try {
        const theme = themes[activeTheme as keyof typeof themes];
        const html = await exportSingleSlideToHtml(
          theme,
          fontSizeMultiplier,
          currentSlideText || " ", // Use initial text or a placeholder
          currentSlide,
          slideLayoutOptions,
          activeFont
        );
        setPreviewHtml(html);
        // The `onLoad` event of the iframe will set `loading` to false
      } catch (error) {
        console.error("Error generating initial preview HTML:", error);
        setPreviewHtml(
          "<html><body><p style='color:red;'>Error loading preview. Check console for details.</p></body></html>"
        );
        setLoading(false);
      }
    };

    generateInitialPreview();
  }, []); // Empty dependency array ensures this runs only once on mount

  // This effect updates the slide's body content via postMessage AFTER the initial load.
  useEffect(() => {
    // Only proceed if the iframe has finished its initial load (loading is false)
    if (loading) {
      return;
    }

    const iframe = iframeRef.current?.contentWindow;
    if (!iframe) {
      return;
    }

    const updateBody = async () => {
      try {
        const bodyHtml = await exportSingleSlideToHtmlbody(
          currentSlideText,
          currentSlide,
          slideLayoutOptions
        );
        iframe.postMessage({ type: "body", data: bodyHtml }, "*");
      } catch (error) {
        console.error("Error generating slide body HTML for postMessage:", error);
      }
    };
    updateBody();

  }, [currentSlideText, currentSlide, slideLayoutOptions, loading]);

  // This effect updates font sizes via postMessage.
  useEffect(() => {
    if (loading) return;
    const iframe = iframeRef.current?.contentWindow;
    if (iframe) {
      const css = generateFontSizesCss(fontSizeMultiplier);
      iframe.postMessage({ type: "fontSize", data: css }, "*");
    }
  }, [fontSizeMultiplier, loading]);
  
  // This effect updates theme and font family via postMessage.
  useEffect(() => {
    if (loading) return;
    const iframe = iframeRef.current?.contentWindow;
    if (iframe) {
      const theme = themes[activeTheme as keyof typeof themes];
      const css = generateThemeCss(
        theme,
        fontFamilies[activeFont as keyof typeof fontFamilies]
      );
      iframe.postMessage({ type: "theme", data: css }, "*");
    }
  }, [activeTheme, activeFont, loading]);

  return {
    previewHtml,
    loading,
    setLoading, // setLoading is called by the iframe's onLoad event handler
  };
}