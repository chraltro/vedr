// src\components\PreviewPanel\LayoutManager\FontSelector.tsx
import React, { useEffect } from "react";
import DropDownButton from "../../UI/DropDownButton";
import { useSlideContext } from "@/context/slideContext";
import { fontFamilies } from "@/utils/export-utils"; // Importer fontFamilies
import { Vim } from "@replit/codemirror-vim";

const fontOptions: Record<string, string> = {};
Object.keys(fontFamilies).forEach((fontKey) => {
  fontOptions[fontKey] = fontKey; // Vis skrifttypenavn som det er
});

export default function FontSelector() {
  const { activeFont, setActiveFont } = useSlideContext();

  const changeFont = (fontName: string) => {
    setActiveFont(fontName);
  };

  const nextFont = () => {
    const fontKeys = Object.keys(fontOptions);
    const currentIndex = fontKeys.indexOf(activeFont);
    const nextIndex = (currentIndex + 1) % fontKeys.length;
    changeFont(fontKeys[nextIndex]);
  };

  useEffect(() => {
    Vim.defineEx("font", "f", nextFont); // Ny Vim-kommando for skrifttype
  }, [nextFont]);

  return (
    <DropDownButton
      color="bg-nord10/80 hover:bg-nord10" // Vælg en tydelig farve
      selectedOption={activeFont}
      options={fontOptions}
      onSelect={changeFont}
    >
      Skrifttype
    </DropDownButton>
  );
}

