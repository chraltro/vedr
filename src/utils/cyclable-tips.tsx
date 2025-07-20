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
    key: "madeWithLove",
    content: (
      <>
        <a
          className=" gap-1  px-1 py-0.5  flex items-center justify-center italic"
          href="https://dijith.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made with{"  "}
          <span className="text-nord11 rotate-2">
            <HeartIcon />
          </span>
          {"  "}& vim by <span className="text-nord9/60 underline ">dijith</span>
        </a>
      </>
    ),
  },
  {
    key: "githubStar",
    content: (
      <>
        <a href="https://github.com/dijith-481/mdpresentation" target="_blank" rel="noopener noreferrer">
          Enjoying md Presentation? Give it a <span style={{ color: "#5e81ac" }}>★</span> on GitHub!
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
        md Presentation: <i> Markdown, beautifully woven. </i>
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
        Vim: <kbd>:f</kbd> to switch font
      </>
    ),
  },
];
