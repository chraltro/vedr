import React from "react";
import useExportFunctions from "@/hooks/useExportFunctions";
import { DownloadIcon, SlideShowIcon, PopOutIcon } from "../UI/Icons";

export default function FullPreviewButton() {
  const { handlePreviewFullSlides, handleSaveAsSlides, handleLivePresent } = useExportFunctions();
  return (
    <div className="w-full flex items-center gap-0.5">
      <button
        onClick={handlePreviewFullSlides}
        className="bg-nord9/80 flex items-center gap-2 justify-center py-2 w-full hover:mx-1 rounded-l-xl h-8 transition-all duration-300 ease-in-out hover:rounded-md hover:bg-nord9 text-nord0"
        title="Preview all slides in a new tab"
      >
        <SlideShowIcon />
        <span>Start Slide Show</span>
      </button>

      <button
        onClick={handleLivePresent}
        className="relative bg-nord10/80 hover:bg-nord10 group flex h-8 w-12 items-center justify-center transition-all duration-300 hover:w-40 hover:z-10"
        title="Open Live Presenter Window"
      >
        <PopOutIcon />
        <span className="absolute left-12 whitespace-nowrap text-nord0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Live Present
        </span>
      </button>

      <button
        onClick={handleSaveAsSlides}
        className="relative bg-nord7/80 hover:bg-nord7 group flex h-8 w-12 items-center justify-center rounded-r-xl transition-all duration-300 hover:w-36 hover:z-10 hover:rounded-r-md"
        title="Download slides"
      >
        <DownloadIcon />
        <span className="absolute left-12 whitespace-nowrap text-nord0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Download
        </span>
      </button>
    </div>
  );
}