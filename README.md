# Vedr - Presentation Builder

A Markdown-to-HTML slide generator with Vim keybindings and live preview. Export self-contained offline presentations with embedded fonts and syntax highlighting.

**Vedr** (Old Norse: "wind" or "weather")

## Features

- Markdown-to-slides conversion with live preview
- Vim keybindings for efficient editing (hjkl navigation, :w to save, :p to preview)
- Multiple clean themes (light/dark/monochrome variants)
- Self-contained HTML export (~2MB with embedded fonts, syntax highlighting, KaTeX)
- Customizable headers, footers, and page numbers
- Font scaling and layout controls
- Local storage persistence
- Code syntax highlighting via Prism.js
- Mathematical expressions via KaTeX
- Mobile-responsive interface with 16:9 aspect ratio preservation

## Live Demo

[chraltro.github.io/vedr](https://chraltro.github.io/vedr)

Example presentations:
- [Dark template](https://chraltro.github.io/vedr/examples/nordDark.html)
- [Light template](https://chraltro.github.io/vedr/examples/nordLight.html)
- [True White template](https://chraltro.github.io/vedr/examples/trueWhite.html)
- [True Black template](https://chraltro.github.io/vedr/examples/trueBlack.html)

## How It Works

1. Write slides using standard Markdown syntax (headings define slide breaks)
2. Live preview updates to show the slide at the current cursor position
3. Customize theme, font size, headers, footers, and page numbers
4. Export as a single self-contained HTML file or download Markdown source

Each Markdown heading (`#` or `##`) creates a new slide. The editor provides instant feedback with a synchronized preview pane. All customizations (theme, font scaling, layout options) are applied in real-time.

### Exported Presentations

Exported HTML files include all dependencies:
- Embedded fonts (Inter for text, Iosevka for code)
- Prism.js for syntax highlighting
- KaTeX for mathematical expressions
- Theme-specific CSS variables
- Interactive navigation controls

File size is approximately 2MB regardless of content length due to embedded assets.

### Navigation

**Keyboard shortcuts:**
- `ArrowRight`, `l`, `PageDown`, `Spacebar`: Next slide
- `ArrowLeft`, `h`, `PageUp`: Previous slide
- `Home`/`End`: First/last slide
- `f`: Fullscreen
- Number keys (`0-9`): Jump to specific slide

**Vim commands:**
- `:w`, `:ws`: Save presentation
- `:u`: Upload Markdown file
- `:p`: Preview mode
- `:t`: Change theme
- `:page`: Toggle page numbers
- `:h`: Add header/footer

**Mouse controls:**
- Navigation buttons appear on hover (bottom right)
- Slide counter shows current position

## Prerequisites

- Node.js 18+

## Local Development

```bash
git clone https://github.com/chraltro/vedr.git
cd vedr
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- Next.js 14 with React 19
- TypeScript
- Tailwind CSS
- CodeMirror 6 with @replit/codemirror-vim
- Marked.js (Markdown parsing)
- Prism.js (syntax highlighting)
- KaTeX (mathematical expressions)

## Project Structure

```
vedr/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with theme system
│   │   └── page.tsx           # Main editor interface
│   ├── components/
│   │   ├── Editor.tsx         # CodeMirror editor with Vim bindings
│   │   ├── Preview.tsx        # Live slide preview
│   │   ├── Controls.tsx       # Theme and layout controls
│   │   └── ExportDialog.tsx   # HTML/Markdown export
│   └── lib/
│       ├── markdown.ts        # Marked.js configuration
│       └── themes.ts          # Theme definitions
└── public/
    └── fonts/                 # Inter and Iosevka font files
```

## Technical Implementation

### Performance Optimization

The live preview system loads fonts at startup and injects only style and text changes during editing. This approach eliminates debounce delays and provides near-instant updates after the initial load.

### Slide Structure

Each slide is rendered as a `<div class="slide">` containing a `<div class="slide-content-wrapper">`. All content maintains 16:9 aspect ratio with viewport-based component sizing. Theme variables control colors and typography across both the editor and exported presentations.

### Offline Support

Exported presentations work offline because all assets (fonts, libraries, styles) are embedded in the HTML file. Images require external hosting and are referenced via relative or absolute paths.

## Deployment

```bash
npm run build
```

Deploy the `out/` directory to any static hosting service.

## License

GPL-3.0
