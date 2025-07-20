import { marked } from "marked";
import { SlideLayoutOptions } from "./layoutOptions";
import { PAGE_NUMBER_SLIDE_ID } from "@/utils/local-storage";
import { themes } from "./themes";
import { Theme } from "./themes";
import { getprsmCss, getprismJs, getKatexCss } from "./export-consts";
import { getEncodedFonts, FontCache } from "./fontDownload";
import markedKatex from "marked-katex-extension";

const options = {
  throwOnError: false,
};

marked.use(markedKatex(options));

const defaultTheme = themes.nordDark;

export const fontFamilies = {
  Inter: "'Inter', sans-serif",
  Iosevka: "'Iosevka', monospace",
  abcdiatype: "'abcdiatype', sans-serif",
  Satoshi: "'Satoshi', sans-serif",
};

export function generateThemeCss(theme?: Theme, activeFontFamily?: string): string {
  const coreTheme = theme || defaultTheme;
  const finalTheme: Record<string, string> = {
    ...coreTheme,
    "--heading-color": coreTheme["--primary-color"],
    "--inline-code-text": coreTheme["--primary-color"],
    "--code-background": "#3b4252",
    "--code-text": "#d8dee9",
    "--hr-color": coreTheme["--primary-color"],
    "--table-border-color": coreTheme["--primary-color"],
    "--table-header-background": coreTheme["--primary-color"],
    "--table-even-row-background": `${coreTheme["--background-color-secondary"]}`,
    "--blockquote-background-color": `${coreTheme["--primary-color"]}1a`,
    "--link-color": coreTheme["--primary-color"],
    "--link-hover-color": coreTheme["--secondary-color"],
    "--header-footer-color": `${coreTheme["--primary-color"]}d0`,
    "--navigation-button-background": `${coreTheme["--primary-color"]}9a`,
    "--navigation-button-disabled-background": coreTheme["--background-color-secondary"],
    "--navigation-button-hover-background": coreTheme["--primary-color"],
    "--navigation-button-color": coreTheme["--background-color"],
    "--navigation-counter-color": coreTheme["--text-color"],
    "--slide-font-family": activeFontFamily || fontFamilies.Inter,
  };
  let css = ":root {\n";
  for (const [key, value] of Object.entries(finalTheme)) {
    css += `  ${key}: ${value};\n`;
  }
  css += "}\n";
  return css;
}

export function generateFontSizesCss(fontSizeMultiplier: number = 1): string {
  const fontSizes = {
    "--slide-font-size": `calc(2.4dvw * ${fontSizeMultiplier})`,
    "--slide-h1-size": `calc(7dvw * ${fontSizeMultiplier})`,
    "--slide-h2-size": `calc(4dvw * ${fontSizeMultiplier})`,
    "--slide-h3-size": `calc(3dvw * ${fontSizeMultiplier})`,
  };
  let css = ":root {\n";
  for (const [key, value] of Object.entries(fontSizes)) {
    css += `  ${key}: ${value};\n`;
  }
  css += "}\n";
  return css;
}

function hasCodeBlocks(markdown: string): boolean {
  return /```/.test(markdown);
}

function splitMarkdownIntoSlides(markdown: string): string[] {
  const lines = markdown.split('\n');
  const slides: string[] = [];
  let currentSlideLines: string[] = [];
  let inCodeBlock = false;
  const headingRegex = /^#{1,2} /; // Corrected Regex: Only match H1 and H2

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
    }

    const isHeading = !inCodeBlock && headingRegex.test(trimmedLine);

    if (isHeading) {
      if (currentSlideLines.length > 0) {
        slides.push(currentSlideLines.join('\n'));
      }
      currentSlideLines = [line];
    } else {
      currentSlideLines.push(line);
    }
  }

  if (currentSlideLines.length > 0) {
    slides.push(currentSlideLines.join('\n'));
  }

  return slides;
}

export function generateSlidesHtml(markdown: string, layoutOpts?: SlideLayoutOptions): string {
  const slideMarkdownArray = splitMarkdownIntoSlides(markdown);
  let content = "";
  if (slideMarkdownArray.length > 0) {
    slideMarkdownArray.forEach((slideMd, i) => {
      const slideContentHtml = marked.parse(slideMd.trim());
      const slideIdAttribute = i === 0 ? ' id="first-slide" class="slide active"' : 'class="slide"';
      let layoutAdditions = "";
      if (layoutOpts && (i > 0 || layoutOpts.layoutOnFirstPage)) {
        layoutOpts.headerFooters.forEach((item) => {
          if (item.id === PAGE_NUMBER_SLIDE_ID) {
            layoutAdditions += `<div class="slide-page-number pos-${item.position}">${i + 1}</div>`;
          } else {
            layoutAdditions += `<div class="slide-header-footer-item pos-${item.position}">${item.text}</div>`;
          }
        });
      }
      content += `<div data-slide-index="${i}" ${slideIdAttribute}><div class="slide-content-wrapper">${slideContentHtml}</div>${layoutAdditions}</div>`;
    });
  } else {
    const fallbackHtml = markdown.trim() ? marked.parse(markdown.trim()) : "<p style='text-align:center;'>Empty presentation.</p>";
    content += `<div class="slide active" data-slide-index="0" id="first-slide"><div class="slide-content-wrapper">${fallbackHtml}</div></div>`;
  }
  content += `<div data-slide-index="${slideMarkdownArray.length}" class="slide"><div class="slide-content-wrapper" style="justify-content:center;align-items:center;text-align:center;font-style:italic;opacity:0.5;">End of Presentation</div></div>`;
  return content;
};

const sharedCss = `
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: var(--slide-font-family);
  background-color: var(--background-color);
  color: var(--text-color);
}
.slides-container {
  width: 100dvw;
  height: 100dvh;
  position: relative;
  overflow: hidden;
}
.slide {
  width: 100%;
  aspect-ratio: 16/9;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
  overflow:hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.slide.active {
  opacity: 1;
  visibility: visible;
  z-index: 1;
}
.slide-content-wrapper {
  transition: opacity 0.3s ease-in-out;
  width: 85%;
  min-height: 75%;
  padding: 2%;
  text-align: left;
  font-size: var(--slide-font-size);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap:2.5%;
}
#first-slide .slide-content-wrapper {
  justify-content: center;
  align-items: center;
  gap:2%;
}
.slide h1, .slide h2, .slide h3, .slide h4, .slide h5, .slide h6 {
  font-weight: 400;
  font-style:bold;
  margin: 0;
  color: var(--heading-color);
  font-family: var(--slide-font-family);
}
.slide h1 {
  font-size: var(--slide-h1-size);
  border:none;
  font-weight:500;
  width:100%;
  padding-bottom: 0;
  text-align: center;
}
.slide h1 a{
  border-bottom: none;
}
.slide h2 {
  font-size: var(--slide-h2-size);
  font-weight:500;
  padding-bottom: 1%;
  border-bottom: 1px solid var(--table-border-color);
}
.slide h3 {
  font-size: var(--slide-h3-size);
}
.slide p {
  padding-left: 5%;
  margin:  0;
  font-weight:400;
  line-height: 1.6;
  text-align:left;
}
#first-slide pre {
  background-color: transparent !important;
  box-shadow: none !important;
  font-color:var(--primary-color) !important;
  border:none !important;
  font-style: italic;
  text-align: center;
}
#first-slide pre code{
  font-family: Iosevka !important;
  color:var(--text-color) !important;
}
#first-slide p {
  text-align: center;
  font-family: var(--slide-font-family);
}
.slide ul, .slide ol {
  padding-left: 1.8em;
  width: 100%;
  margin: 0;
}
.slide li > ul, .slide li > ol {
  margin-top: 0.5em;
}
.slide li {
  font-weight:500;
  padding-left: 0.6em;
  padding-bottom: 1%;
}
.slide blockquote {
  border-left: 5px solid var(--primary-color);
  border-radius: 4px ;
  padding: 2% 4%;
  background-color: var(--blockquote-background-color);
  color: var(--text-color);
  font-style: italic;
  min-width: 70% ;
  max-width: 93%;
}
.slide blockquote code:not(pre code) {
  font-style: normal;
  font-size:inherit;
}

.slide a {
  color: var(--link-color);
  text-decoration: none;
  font-weight: 500;
}
.slide a:hover {
  color: var(--link-hover-color);
  text-decoration: underline;
}
.slide pre {
  overflow:unset !important;
  margin: 0.5em 2% !important;
  border-radius: 1vw;
  color: var(--code-text);
  padding: 2% 4% !important;
  background-color: var(--code-background) !important;
  border: 1px solid #81a1c1;
  max-width: 93%;
  min-width: 70%;
}

.slide pre code {
  background-color: transparent;
  color: var(--code-text);
  font-family: Iosevka, monospace !important;
  font-size: inherit;
}
.slide pre code .token.comment {
  font-style: italic;
  color: #606e87;
}
.slide code:not(pre code) {
  background-color: var(--background-color-secondary);
  color: var(--inline-code-text);
  padding: 0.1% 1%;
  border-radius: 0.5vw;
  font-family: Iosevka, monospace !important;
  font-size: calc(var(--slide-font-size) * 0.9 );
  font-weight:300;
}
.slide table {
  width: 100%;
  border-radius: 1vw;
  overflow: hidden;
  font-size: calc(var(--slide-font-size) * 0.9);
  border-collapse: collapse;
}
.slide thead {
  padding:0 0 0 0;
  background-color: var(--table-header-background);
}
.slide thead th {
  color: var(--background-color);
  font-weight: 700;
}
.slide tr {
  border-bottom: 1px solid var(--table-border-color);
}
.slide tbody tr:last-child {
  border-bottom: none;
}
.slide tbody tr:nth-child(even) {
  background-color: var(--table-even-row-background);
}
.slide th, .slide td {
  padding: 1% 2%;
  border-left: 1px solid var(--table-border-color);
}
.slide th:first-child, .slide td:first-child {
  border-left: none;
}
.slide img {
  max-width: 70dvw;
  max-height: 30dvh;
  height: auto;
  border-radius: 4px;
  margin: 1em auto;
  display: block;
}
.slide input{
  color: var(--primary-color);
  background-color: var(--background-color-secondary);
  accent-color:  var(--primary-color);
}
.slide  input:disabled {
  accent-color:  var(--primary-color);
  }
.slide input:checked {
  accent-color:  var(--primary-color);
    border: 2px solid yellow;
}
.slide hr {
  margin: 1.5em 0;
  border: 0;
  border-top: 2px solid var(--hr-color);
  width:100%;
}
.slide del {
  text-decoration: line-through;
  opacity: 0.9;
  font-style: italic;
  text-decoration-style: wavy;
  text-decoration-thickness: 5%;
}
.slide-header-footer-item, .slide-page-number {
  position: absolute;
  font-size: 1.2dvw;
  color: var(--header-footer-color);
  padding: 3vmin 3.5vmin;
  z-index: 10;
  font-family: var(--slide-font-family);
  font-weight:400;
  white-space: nowrap;
}
.pos-top-left { top: 0; left: 0; text-align: left; }
.pos-top-center { top: 0; left: 50%; transform: translateX(-50%); text-align: center; }
.pos-top-right { top: 0; right: 0; text-align: right; }
.pos-bottom-left { bottom: 0; left: 0; text-align: left; }
.pos-bottom-center { bottom: 0; left: 50%; transform: translateX(-50%); text-align: center; }
.pos-bottom-right { bottom: 0; right: 0; text-align: right; }
`;

const multiSlideCss = `
.slide-navigation {
  position: fixed;
  bottom: 2dvh;
  left: 0;
  width: 100dvw;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center; 
  gap: 1dvh;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
.slide-navigation.simulated-hover, .slide-navigation:hover {
  opacity: 1;
}
.slide-navigation button {
  background-color: var(--navigation-button-background);
  color: var(--navigation-button-color);
  border: none;
  padding: 0.5dvh 1dvw;
  border-radius: 20px; 
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center; 
  min-width: 60px;
  height: 40px; 
  transition: background-color 0.2s ease, transform 0.1s ease;
}
.slide-navigation button:hover {
  background-color: var(--navigation-button-hover-background);
}
.slide-navigation button:active {
  transform: translateY(1px);
}
.slide-navigation button:disabled {
  background-color: var(--navigation-button-disabled-background);
  cursor: not-allowed;
}
.fullscreen-button {
  background-color: var(--secondary-color) !important;
}
#slide-counter {
  background-color: transparent;
  color: var(--navigation-counter-color);
  padding: 0.5dvh 1dvw;
  border-radius: 20px; 
  font-size: 1dvw;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center; 
  min-width: 60px;
  height: 40px; 
  font-variant-numeric: tabular-nums; 
}
`;

function generateAllFontFaces(encodedFonts: FontCache): string {
  let fontFaces = `
    @font-face{
        font-family: 'Inter';
        src: url('data:font/woff2;base64,${encodedFonts.inter}') format('woff2');
        font-weight: 100 900;
        font-display: swap; 
        font-style: normal;
    }
    @font-face {
        font-family: 'Iosevka';
        src: url('data:font/woff2;base64,${encodedFonts.iosevka}') format('woff2');
        font-weight: 400;
        font-display: swap;
        font-style: normal;
    }
  `;
  if (encodedFonts.diatype) {
    fontFaces += `
    @font-face {
        font-family: 'abcdiatype';
        src: url('data:font/woff2;base64,${encodedFonts.diatype}') format('woff2');
        font-weight: 100 900;
        font-display: swap;
        font-style: normal;
    }
    `;
  }
  if (encodedFonts.satoshi) {
    fontFaces += `
    @font-face {
        font-family: 'Satoshi';
        src: url('data:font/woff2;base64,${encodedFonts.satoshi}') format('woff2');
        font-weight: 100 900;
        font-display: swap;
        font-style: normal;
    }
    `;
  }
  return fontFaces;
}

export async function exportToCustomSlidesHtml(
  fullMarkdown: string,
  layoutOptions: SlideLayoutOptions,
  documentTitle: string,
  theme: Theme,
  fontSizeMultiplier: number,
  activeFont: string,
  mode: "export" | "live" = "export",
): Promise<string> {
    const hasCode = hasCodeBlocks(fullMarkdown);
    const encodedFonts = await getEncodedFonts();
    const themeCss = generateThemeCss(theme, fontFamilies[activeFont as keyof typeof fontFamilies]);
    const fontSizesCss = generateFontSizesCss(fontSizeMultiplier);
    const prismJsContent = hasCode ? await getprismJs() : "";

    const styles = `
    <style id="font-faces">${generateAllFontFaces(encodedFonts)}</style>
    <style id="prism-styles">${hasCode ? await getprsmCss() : ""}</style>
    <style id="katex-styles">${await getKatexCss()}</style>
    <style id="theme-styles">${themeCss}</style>
    <style id="font-styles">${fontSizesCss}</style>
    <style id="shared-styles">${sharedCss}</style>
    <style id="multislide-styles">${multiSlideCss}</style>
  `;

  const liveModeScript = `
    <script>
      ${prismJsContent}
      const channel = new BroadcastChannel('md-presenter-channel');

      function updateStyles(stylePayload) {
        document.getElementById('theme-styles').innerHTML = stylePayload.themeCss;
        document.getElementById('font-styles').innerHTML = stylePayload.fontSizesCss;
      }

      function updateSlides(slidesHtml) {
        const container = document.querySelector('.slides-container');
        if (container) {
          container.innerHTML = slidesHtml;
          if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
          }
          initializeNavigation();
        }
      }

      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'stylesUpdate') {
          updateStyles(payload);
        } else if (type === 'slidesUpdate') {
          updateSlides(payload);
        }
      };
      
      let currentSlideIdx = 0;
      let slideElements = [];
      
      function showSlideByIndex(index) {
          if (!slideElements || slideElements.length === 0) return;
          const newIndex = Math.max(0, Math.min(index, slideElements.length - 1));
          if (newIndex === currentSlideIdx && slideElements[newIndex] && slideElements[newIndex].classList.contains('active')) return;

          if (slideElements[currentSlideIdx]) {
            slideElements[currentSlideIdx].classList.remove("active");
          }
          if(slideElements[newIndex]) {
            slideElements[newIndex].classList.add("active");
          }
          currentSlideIdx = newIndex;
          if (typeof Prism !== "undefined" && slideElements[currentSlideIdx]) {
            Prism.highlightAllUnder(slideElements[currentSlideIdx]);
          }
          updateNavigationControls();
      }
      
      function updateNavigationControls() {
          const prevBtn = document.getElementById("prev-slide");
          const nextBtn = document.getElementById("next-slide");
          const counterElem = document.getElementById("slide-counter");
          const startBtn = document.getElementById("start-slide");
          const endBtn = document.getElementById("end-slide");

          if (!prevBtn || !nextBtn || !counterElem || !startBtn || !endBtn) return;
          const totalSlides = slideElements.length;
          
          startBtn.disabled = currentSlideIdx === 0;
          prevBtn.disabled = currentSlideIdx === 0;
          nextBtn.disabled = currentSlideIdx >= totalSlides - 1;
          endBtn.disabled = currentSlideIdx >= totalSlides - 1;
          counterElem.textContent = totalSlides > 0 ? \`\${currentSlideIdx + 1} / \${totalSlides}\` : "0 / 0";
      }

      function handleKeydown(e) {
        let newIdx = currentSlideIdx;
        if (e.key === "f") { 
          e.preventDefault(); 
          document.documentElement.requestFullscreen().catch(err => console.log(err)); 
        } else if (e.key === "ArrowLeft" || e.key === "h") {
          newIdx--;
        } else if (e.key === "ArrowRight" || e.key === "l" || e.key === " ") {
          newIdx++;
        } else if (e.key === "Home") {
          newIdx = 0;
        } else if (e.key === "End") {
          newIdx = slideElements.length - 1;
        } else {
          return;
        }
        e.preventDefault();
        showSlideByIndex(newIdx);
      }
      
      function initializeNavigation() {
        slideElements = document.querySelectorAll(".slide");
        currentSlideIdx = -1; 

        const startBtn = document.getElementById("start-slide");
        const prevBtn = document.getElementById("prev-slide");
        const nextBtn = document.getElementById("next-slide");
        const endBtn = document.getElementById("end-slide");
        const fullscreenBtn = document.getElementById("fullscreen");
        
        if(startBtn) startBtn.onclick = () => showSlideByIndex(0);
        if(prevBtn) prevBtn.onclick = () => showSlideByIndex(currentSlideIdx - 1);
        if(nextBtn) nextBtn.onclick = () => showSlideByIndex(currentSlideIdx + 1);
        if(endBtn) endBtn.onclick = () => showSlideByIndex(slideElements.length - 1);
        if(fullscreenBtn) fullscreenBtn.onclick = () => document.documentElement.requestFullscreen().catch(err => console.log(err));

        document.removeEventListener('keydown', handleKeydown);
        document.addEventListener('keydown', handleKeydown);
        
        showSlideByIndex(0);
      }
      
      document.addEventListener("DOMContentLoaded", initializeNavigation);
    </script>
  `;

  const exportModeScript = `
    <script>
      ${prismJsContent}
      document.addEventListener("DOMContentLoaded", () => {
        let currentSlideIdx = 0;
        const slideElements = document.querySelectorAll(".slide");
        const startBtn = document.getElementById("start-slide");
        const prevBtn = document.getElementById("prev-slide");
        const nextBtn = document.getElementById("next-slide");
        const endBtn = document.getElementById("end-slide");
        const fullScreenBtn = document.getElementById("fullscreen");
        const counterElem = document.getElementById("slide-counter");

        function showSlideByIndex(index) {
          if (!slideElements || slideElements.length === 0) return;
          const newIndex = Math.max(0, Math.min(index, slideElements.length - 1));
          if (newIndex === currentSlideIdx) return;

          slideElements[currentSlideIdx].classList.remove("active");
          slideElements[newIndex].classList.add("active");
          currentSlideIdx = newIndex;

          if (typeof Prism !== "undefined") {
            Prism.highlightAllUnder(slideElements[currentSlideIdx]);
          }
          updateNavigationControls();
        }

        function updateNavigationControls() {
          if (!prevBtn || !nextBtn || !counterElem || !startBtn || !endBtn || !fullScreenBtn) return;
          const totalSlides = slideElements.length;
          startBtn.disabled = currentSlideIdx === 0;
          prevBtn.disabled = currentSlideIdx === 0;
          nextBtn.disabled = currentSlideIdx >= totalSlides - 1;
          endBtn.disabled = currentSlideIdx >= totalSlides - 1;
          counterElem.textContent = totalSlides > 0 ? \`\${currentSlideIdx + 1} / \${totalSlides}\` : "0 / 0";
        }

        if (slideElements.length > 0) {
          showSlideByIndex(0);
        }
        
        updateNavigationControls();

        startBtn.addEventListener("click", () => showSlideByIndex(0));
        prevBtn.addEventListener("click", () => showSlideByIndex(currentSlideIdx - 1));
        nextBtn.addEventListener("click", () => showSlideByIndex(currentSlideIdx + 1));
        endBtn.addEventListener("click", () => showSlideByIndex(slideElements.length - 1));
        fullScreenBtn.addEventListener("click", () => {
          document.documentElement.requestFullscreen().catch(err => console.log(err));
        });

        document.addEventListener("keydown", (e) => {
          let newIdx = currentSlideIdx;
          if (e.key === "f") {
            e.preventDefault();
            document.documentElement.requestFullscreen().catch(err => console.log(err));
          } else if (e.key === "ArrowLeft" || e.key === "h") {
            newIdx = currentSlideIdx - 1;
          } else if (e.key === "ArrowRight" || e.key === "l" || e.key === " ") {
            newIdx = currentSlideIdx + 1;
          } else if (e.key === "Home") {
            newIdx = 0;
          } else if (e.key === "End") {
            newIdx = slideElements.length - 1;
          } else if (e.key >= "0" && e.key <= "9") {
            let slideNum = e.key === '0' ? 10 : parseInt(e.key);
            if (slideNum <= slideElements.length) {
              newIdx = slideNum - 1;
            }
          } else {
            return;
          }
          e.preventDefault();
          showSlideByIndex(newIdx);
        });
      });
    </script>
  `;

  const finalHtml = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${documentTitle || "Markdown Slides"}</title>
        ${styles}
      </head>
      <body>
        <div class="slides-container">${generateSlidesHtml(fullMarkdown, layoutOptions)}</div>
        <div class="slide-navigation">
          <button id="start-slide" title="First Slide (Home)">«</button>
          <button id="prev-slide" title="Previous Slide (← h)">‹</button>
          <span id="slide-counter">1 / N</span>
          <button id="next-slide" title="Next Slide (→ l)">›</button>
          <button id="end-slide" title="Last Slide (End)">»</button>
          <button id="fullscreen" title="Toggle Fullscreen (f)">⛶</button>
        </div>
        ${mode === 'live' ? liveModeScript : exportModeScript}
      </body>
    </html>`;

  return finalHtml;
}

export async function exportSingleSlideToHtml(
  theme: Theme,
  fontSizeMultiplier: number,
  slideMarkdown: string | null,
  currentPageNo: number,
  layoutOptions?: SlideLayoutOptions,
  activeFont?: string,
) {
  const themeCss = generateThemeCss(theme, fontFamilies[activeFont as keyof typeof fontFamilies]);
  const fontSizesCss = generateFontSizesCss(fontSizeMultiplier);
  const prismCss = await getprsmCss();
  const prismJs = await getprismJs();
  const katexCss = await getKatexCss();
  const encodedFonts = await getEncodedFonts();
  const body = await exportSingleSlideToHtmlbody(slideMarkdown, currentPageNo, layoutOptions);

  const styles = `
    <style>${generateAllFontFaces(encodedFonts)}</style>
    <style>${prismCss}</style>
    <style>${katexCss}</style>
    <style class="theme-css">${themeCss}</style>
    <style>${sharedCss}</style>
    <style class="font-size-css">${fontSizesCss}</style>
  `;

  const scripts = `
    <script>${prismJs}</script>
    <script>
    document.addEventListener("DOMContentLoaded", () => {
      if (typeof Prism !== "undefined") {
        Prism.highlightAll();
      }
    });

    window.addEventListener("message", (event) => {
      const { type, data } = event.data;
      if (type === "body") {
        document.body.innerHTML = data;
        if (typeof Prism !== "undefined") {
          Prism.highlightAll();
        }
      } else if (type === "fontSize") {
        const styleEl = document.querySelector(".font-size-css");
        if (styleEl) styleEl.innerHTML = data;
      } else if (type === "theme") {
        const styleEl = document.querySelector(".theme-css");
        if (styleEl) styleEl.innerHTML = data;
      }
    });
    </script>
  `;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slide Preview</title>
    ${styles}
</head>
<body>
${body}
    ${scripts}
</body>
</html>`;
}

export async function exportSingleSlideToHtmlbody(
  slideMarkdown: string | null,
  currentPageNo: number,
  layoutOptions?: SlideLayoutOptions,
): Promise<string> {
  let layoutAdditions = "";
  if (layoutOptions) {
    if (currentPageNo > 1 || layoutOptions.layoutOnFirstPage) {
      layoutOptions.headerFooters.forEach((item) => {
        if (item.id === PAGE_NUMBER_SLIDE_ID) {
          layoutAdditions += `<div class="slide-page-number pos-${item.position}">${currentPageNo}</div>`;
        } else {
          layoutAdditions += `<div class="slide-header-footer-item pos-${item.position}">${item.text}</div>`;
        }
      });
    }
  }
  const slideIdAttribute =
    currentPageNo === 1 ? ' id="first-slide" class="slide active"' : 'class="slide active"';
  const slideContentHtml =
    slideMarkdown && slideMarkdown.trim()
      ? await marked.parse(slideMarkdown.trim())
      : '<p style="text-align:center; font-size: var(--slide-font-size);"><em>Empty slide. nothing to weave.</em></p>';
  const slidesHtmlContent = `
    <div class="slides-container">
      <div data-slide-index="0" ${slideIdAttribute}>
        <div class="slide-content-wrapper">${slideContentHtml}</div>
        ${layoutAdditions}
      </div>
    </div>
  `;
  return slidesHtmlContent;
}