import { HeartIcon } from "@/components/UI/Icons";
export const cyclingTips = [
  {
    key: "focus",
    content: (
      <>
        Press   <kbd>i</kbd> to focus the editor
      </>
    ),
  },
  {
    key: "dd",
    content: (
      <>
        Vim: <kbd>dd</kbd>
        to delete your undoes one by one <HeartIcon />
      </>
    ),
  },
  {
    key: "vimSaveMd",
    content: (
      <>
        Vim:   <kbd>:w</kbd> to save .md
      </>
    ),
  },
  {
    key: "replace",
    content: (
      <>
        <kbd>:%s/alone/together/g</kbd>
      </>
    ),
  },
  {
    key: "vimSaveSlides",
    content: (
      <>
        Vim:  <kbd>:ws</kbd> to save Slides
      </>
    ),
  },
  {
    key: "hjklGoBrrr",
    content: (
      <>
        Not making slides? Then <code>hjkl</code> go hlkj;hkl;!
      </>
    ),
  },
  {
    key: "vimUpload",
    content: (
      <>
        Vim:   <kbd>:u</kbd>
        to upload file
      </>
    ),
  },
  {
    key: "vimpreview",
    content: (
      <>
        Vim:   <kbd>:p</kbd>
        to start slideshow
      </>
    ),
  },
  {
    key: "slidesSyntax",
    content: (
      <>
        Slides: Use <code># Title</code> / <code>## Heading</code>.
      </>
    ),
  },
  {
    key: "githubStar",
    content: (
      <>
        <a href="https://github.com/chraltro/vedr" target="_blank" rel="noopener noreferrer">
          Enjoying Vedr? Give it a <span style={{ color: "#5e81ac" }}>★</span> on GitHub!
        </a>
      </>
    ),
  },
  {
    key: "ggVg",
    content: (
      <>
        Vim:<kbd>ggVG</kbd>
        to select all your deepest desires at once
      </>
    ),
  },
  {
    key: "tagline",
    content: (
      <>
        Vedr: <i>Swift presentations, flowing like the wind.</i>
      </>
    ),
  },
  {
    key: "deleteAllContent",
    content: (
      <>
        Vim: <kbd>ggdG</kbd>
        to delete all content
      </>
    ),
  },
  {
    key: "vimFont", // New tip for font selection
    content: (
      <>
        Vim: <kbd>:f</kbd> to switch font (e.g., to abcdiatype)
      </>
    ),
  },
];
