import { useState, useEffect, useRef } from "react";
import { slideTemplates } from "../utils/slide-templates";
import { SlideLayoutOptions } from "../utils/layoutOptions";
import {
  LOCAL_STORAGE_MARKDOWN_TEXT_KEY,
  LOCAL_STORAGE_THEME_KEY,
  LOCAL_STORAGE_FONT_MULTIPLIER_KEY,
  LOCAL_STORAGE_LAYOUT_OPTIONS_KEY,
  LOCAL_STORAGE_FONT_KEY,
} from "../utils/local-storage";

// Define the shape of the data we will broadcast
interface BroadcastState {
  markdownText: string;
  activeTheme: string;
  fontSizeMultiplier: number;
  activeFont: string;
  slideLayoutOptions: SlideLayoutOptions;
}

export function usePersistentSettings() {
  const [markdownText, setMarkdownText] = useState<string>("");
  const [activeTheme, setActiveTheme] = useState<string>("nordDark");
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState<number>(1);
  const [activeFont, setActiveFont] = useState<string>("Inter");
  const [slideLayoutOptions, setSlideLayoutOptions] = useState<SlideLayoutOptions>({
    layoutOnFirstPage: false,
    headerFooters: [],
  });

  // Use a ref to hold the broadcast channel instance
  const channel = useRef<BroadcastChannel | null>(null);

  // Initialize channel only on the client side
  useEffect(() => {
    channel.current = new BroadcastChannel("md-presenter-channel");
    return () => {
      channel.current?.close();
    };
  }, []);

  // Load initial settings from localStorage
  useEffect(() => {
    const savedMarkdown = localStorage.getItem(LOCAL_STORAGE_MARKDOWN_TEXT_KEY);
    setMarkdownText(savedMarkdown || slideTemplates.master);
    setActiveTheme(localStorage.getItem(LOCAL_STORAGE_THEME_KEY) || "nordDark");
    const storedMultiplier = localStorage.getItem(LOCAL_STORAGE_FONT_MULTIPLIER_KEY);
    setFontSizeMultiplier(storedMultiplier ? parseFloat(storedMultiplier) : 1);
    setActiveFont(localStorage.getItem(LOCAL_STORAGE_FONT_KEY) || "Inter");
    const storedLayoutOptions = localStorage.getItem(LOCAL_STORAGE_LAYOUT_OPTIONS_KEY);
    setSlideLayoutOptions(
      storedLayoutOptions
        ? JSON.parse(storedLayoutOptions)
        : { layoutOnFirstPage: false, headerFooters: [] },
    );
  }, []);

  // Effect to save to localStorage
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(LOCAL_STORAGE_MARKDOWN_TEXT_KEY, markdownText);
    }, 500);
    return () => clearTimeout(handler);
  }, [markdownText]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_FONT_MULTIPLIER_KEY, fontSizeMultiplier.toString());
  }, [fontSizeMultiplier]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_LAYOUT_OPTIONS_KEY, JSON.stringify(slideLayoutOptions));
  }, [slideLayoutOptions]); // Watch the whole object

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_FONT_KEY, activeFont);
  }, [activeFont]);

  // NEW: This effect broadcasts the entire state whenever any part of it changes.
  useEffect(() => {
    const stateToBroadcast: BroadcastState = {
      markdownText,
      activeTheme,
      fontSizeMultiplier,
      activeFont,
      slideLayoutOptions,
    };
    channel.current?.postMessage({ type: "stateUpdate", payload: stateToBroadcast });
  }, [markdownText, activeTheme, fontSizeMultiplier, activeFont, slideLayoutOptions]);

  return {
    markdownText,
    setMarkdownText,
    activeTheme,
    setActiveTheme,
    fontSizeMultiplier,
    setFontSizeMultiplier,
    activeFont,
    setActiveFont,
    slideLayoutOptions,
    setSlideLayoutOptions,
  };
}