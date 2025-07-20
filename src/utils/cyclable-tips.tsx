import { HeartIcon } from "@/components/UI/Icons";
export const cyclingTips = [
  {
    key: "focus",
    content: (
      <>
        Tryk   <kbd>i</kbd> for at fokusere editoren
      </>
    ),
  },
  {
    key: "dd",
    content: (
      <>
        Vim: <kbd>dd</kbd>
        for at slette dine fortrydelser én ad gangen <HeartIcon /> {/* FIXED HERE */}
      </>
    ),
  },
  {
    key: "vimSaveMd",
    content: (
      <>
        Vim:   <kbd>:w</kbd> for at gemme .md
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
        Vim:  <kbd>:ws</kbd> for at gemme Slides
      </>
    ),
  },
  {
    key: "hjklGoBrrr",
    content: (
      <>
        Laver du ikke slides? Så <code>hjkl</code> go hlkj;hkl;!
      </>
    ),
  },
  {
    key: "vimUpload",
    content: (
      <>
        Vim:   <kbd>:u</kbd>
        for at uploade fil
      </>
    ),
  },
  {
    key: "vimpreview",
    content: (
      <>
        Vim:   <kbd>:p</kbd>
        for at starte slideshow
      </>
    ),
  },
  {
    key: "slidesSyntax",
    content: (
      <>
        Slides: Brug <code># Titel</code> / <code>## Overskrift</code>.
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
          Lavet med{"  "}
          <span className="text-nord11 rotate-2">
            <HeartIcon />
          </span>
          {"  "}& vim af <span className="text-nord9/60 underline ">dijith</span>
        </a>
      </>
    ),
  },
  {
    key: "githubStar",
    content: (
      <>
        <a href="https://github.com/dijith-481/mdpresentation" target="_blank" rel="noopener noreferrer">
          Nyder du md Presentation? Giv den en <span style={{ color: "#5e81ac" }}>★</span> på GitHub!
        </a>
      </>
    ),
  },
  {
    key: "ggVg",
    content: (
      <>
        Vim:<kbd>ggVG</kbd>
        for at vælge alle dine dybeste ønsker på én gang
      </>
    ),
  },
  {
    key: "tagline",
    content: (
      <>
        md Presentation: <i> Markdown, smukt vævet. </i>
      </>
    ),
  },
  {
    key: "deleteAllContent",
    content: (
      <>
        Vim: <kbd>ggdG</kbd>
        for at slette alt indhold
      </>
    ),
  },
  {
    key: "vimFont", // Nyt tip til skrifttypevalg
    content: (
      <>
        Vim: <kbd>:f</kbd> for at skifte skrifttype
      </>
    ),
  },
];

