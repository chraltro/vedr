import useExportFunctions from "@/hooks/useExportFunctions";
import { UploadIcon, DownloadIcon } from "@/components/UI/Icons";
import DropDownButton from "./UI/DropDownButton";

interface AppHeaderProps {
  fileUploadRef: React.RefObject<{ triggerFileUpload: () => void } | null>;
}

export default function AppHeader({ fileUploadRef }: AppHeaderProps) {
  const triggerFileUpload = () => fileUploadRef.current?.triggerFileUpload();

  const { handleDownloadMd, handleSaveAsSlides } = useExportFunctions();

  return (
    <header className="py-1 px-2 md:py-2 h-16 flex justify-between items-center space-x-2 text-nord9 md:px-4">
      <div className="flex items-center space-x-2">
        <img
          src="/vedr/logo.svg"
          alt="VEDR"
          className="h-8 w-8 md:h-10 md:w-10 opacity-80 hover:opacity-100 transition-opacity"
        />
        <span className="hidden md:inline-block text-lg font-semibold tracking-wide text-nord4" style={{fontFamily: 'Cinzel, serif'}}>
          VEDR
        </span>
      </div>
      <div className="flex items-center space-x-2">
      <div
        className="flex flex-row items-center group transition-all px-1 py-1 rounded-md ease-in-out duration-700 w-10 hover:w-32 overflow-hidden"
        title="Download a Markdown file (.md) or HTML slides"
      >
        <DropDownButton
          color="text-nord9"
          options={{
            Slides: "HTML Slides",
            ".md": "Markdown (.md)",
          }}
          onSelect={(option) => {
            if (option === ".md") {
              handleDownloadMd();
            } else {
              handleSaveAsSlides();
            }
          }}
        >
          <span className="flex-shrink-0">
            <DownloadIcon />
          </span>
          <div className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <span className="ml-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              Download
            </span>
          </div>
        </DropDownButton>
      </div>
      <button
        onClick={triggerFileUpload}
        className="flex flex-row items-center group transition-all px-1 py-1 rounded-md ease-in-out duration-700 w-10 hover:w-24 overflow-hidden"
        title="Upload a Markdown file (.md) (Ctrl+O)"
      >
        <span className="flex-shrink-0">
          <UploadIcon />
        </span>
        <span className="ml-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          Upload
        </span>
      </button>
      </div>
    </header>
  );
}