import { exportToCustomSlidesHtml } from "../utils/export-utils";
import { useSlideContext } from "@/context/slideContext";
import { themes } from "@/utils/themes";

export default function useExportFunctions() {
  const { markdownText, slideLayoutOptions, fontSizeMultiplier, activeTheme, activeFont } =
    useSlideContext();

  // Mode can be 'export' (for file saving) or 'live' (for the presenter window)
  async function createHtmlBlob(
    documentTitle: string,
    mode: "export" | "live" = "export",
  ): Promise<Blob> {
    const theme = themes[activeTheme as keyof typeof themes];
    const markdown = mode === "live" ? markdownText : markdownText.trim();
    if (!markdown) {
      throw new Error("Nothing to process! Write some Markdown first.");
    }
    try {
      const htmlContent = await exportToCustomSlidesHtml(
        markdown,
        slideLayoutOptions,
        documentTitle,
        theme,
        fontSizeMultiplier,
        activeFont,
        mode, // Pass the mode to the export function
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

  // NEW: Function to open and manage the live presenter window
  async function handleLivePresent() {
    try {
      const documentTitle = getFilenameFromFirstH1("Live Presentation");
      const blob = await createHtmlBlob(documentTitle, "live");
      const blobUrl = URL.createObjectURL(blob);

      // Open a new window. The name "md-presenter" helps to focus it if it's already open.
      const presenterWindow = window.open(
        blobUrl,
        "md-presenter",
        "width=1280,height=720,resizable=yes,scrollbars=yes",
      );
      if (!presenterWindow) {
        alert("Please allow pop-ups for this feature to work.");
      }
    } catch (error) {
      alert(error);
    }
  }

  async function handleSaveAsSlides() {
    try {
      const filenameBase = getFilenameFromFirstH1("slides_presentation");
      const blob = await createHtmlBlob(filenameBase, "export"); // Explicitly 'export' mode
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
      const blob = await createHtmlBlob(documentTitle, "export"); // Explicitly 'export' mode
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
    handleLivePresent, // Expose the new function
  };
}