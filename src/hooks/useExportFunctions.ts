import { exportToCustomSlidesHtml } from "../utils/export-utils";
import { useSlideContext } from "@/context/slideContext";
import { themes } from "@/utils/themes";

export default function useExportFunctions() {
  const { markdownText, slideLayoutOptions, fontSizeMultiplier, activeTheme, activeFont } = useSlideContext();

  async function createHtmlBlob(documentTitle: string): Promise<Blob> {
    const theme = themes[activeTheme as keyof typeof themes];
    if (!markdownText.trim()) {
      throw new Error("Nothing to process! Write some Markdown first.");
    }
    try {
      const htmlContent = await exportToCustomSlidesHtml(
        markdownText,
        slideLayoutOptions,
        documentTitle,
        theme,
        fontSizeMultiplier,
        activeFont,
      );
      return new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
    } catch (error) {
      console.error("Failed to generate HTML content:", error);
      throw new Error("Failed to generate HTML content. Please check the console for errors.");
    }
  }

  function getFilenameFromFirstH1(defaultName: string = "document"): string {
    if (!markdownText || typeof markdownText !== "string") {
      return defaultName;
    }
    const lines = markdownText.split("\n");
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("# ")) {
        let headingText = trimmedLine.substring(2).trim();
        headingText = headingText
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "_")
          .substring(0, 50);
        return headingText || defaultName;
      }
    }
    return defaultName;
  }

  async function handleLivePresent() {
    const presenterHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Live Presenter</title>
        <style>
          body { margin: 0; overflow: hidden; background-color: #2e3440; }
          iframe { width: 100vw; height: 100vh; border: none; }
        </style>
      </head>
      <body>
        <iframe id="presenter-iframe"></iframe>
        <script>
          const iframe = document.getElementById('presenter-iframe');
          const channel = new BroadcastChannel('md-presenter-channel');
          
          channel.onmessage = (event) => {
            if (event.data.type === 'fullUpdate') {
              iframe.srcdoc = event.data.data;
            }
          };

          // Ask the main window for the latest content when this window first loads
          channel.postMessage({ type: 'requestInitial' });
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([presenterHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "md-presenter", "width=1280,height=720,resizable=yes,scrollbars=no");
  }

  async function handleSaveAsSlides() {
    try {
      const filenameBase = getFilenameFromFirstH1("slides_presentation");
      const blob = await createHtmlBlob(filenameBase);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${filenameBase}.html`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(error);
    }
  }

  async function handlePreviewFullSlides() {
    try {
      const documentTitle = getFilenameFromFirstH1("Slides Preview");
      const blob = await createHtmlBlob(documentTitle);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      alert(error);
    }
  }

  async function handleDownloadMd() {
    if (!markdownText.trim()) {
      alert("Nothing to download!");
      return;
    }
    const filenameBase = getFilenameFromFirstH1("markdown_document");
    const blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filenameBase}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return {
    handleSaveAsSlides,
    handlePreviewFullSlides,
    handleDownloadMd,
    getFilenameFromFirstH1,
    handleLivePresent,
  };
}