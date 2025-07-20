import React from "react";
import useExportFunctions from "@/hooks/useExportFunctions";
import { DownloadIcon, SlideShowIcon, PopOutIcon } from "../UI/Icons";

export default function FullPreviewButton() {
  const { handlePreviewFullSlides, handleSaveAsSlides, handleLivePresent } = useExportFunctions();
  return (
    <div className="w-full flex items-center gap-0.5">
      <button
        onClick={handlePreviewFullSlides}
        className="bg-nord9/80 flex h-8 w-full items-center justify-center gap-2 rounded-l-xl px-4 text-nord0 transition-all duration-300 ease-in-out hover:mx-1 hover:rounded-md hover:bg-nord9"
        title="Preview all slides in a new tab"
      >
        <SlideShowIcon />
        <span>Start Slide Show</span>
      </button>

      <button
        onClick={handleLivePresent}
        className="relative group flex h-8 w-12 items-center overflow-hidden bg-nord10/80 transition-all duration-300 hover:w-36 hover:z-10 hover:bgIcon />
        <span className="whitespace-nowrap">Start Slide Show</span>
      </button>

      <button
        onClick={handleLivePresent}
        className="group relative flex h-8 w-12 items-center overflow-hidden bg-nord10/80 text-nord0 transition-all duration-300 hover:w-36 hover:bg-nord10 hover:z-10"
        title="Open Live Presenter Window"
      >
        <div className="absolute inset-y-0 left-0 flex w-12 items-center justify-center">
          <PopOutIcon />
        </div>
        <span className="pl-14 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Live Present
        </span>
      </button>

      <button
        onClick={handleSaveAsSlides}
        className="group relative flex h-8 w-12 items-center overflow-hidden rounded-r-xl bg-nord7/80 text-nord0 transition-all duration-300 hover:w-36 hover:rounded-r-md hover:bg-nord7 hover:z-10"
        title="Download slides"
      >
        <div className="absolute inset-y-0 left-0 flex w-12 items-center justify-center">
          <DownloadIcon />
        </div>
        <span className="pl-14 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Download
        </span>
      </button>
    </div>
  );
}