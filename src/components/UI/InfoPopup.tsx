import { CloseIcon } from "./Icons";

interface InfoPopupProps {
  show: boolean;
  onClose: () => void;
  popupRef: React.RefObject<HTMLDivElement | null>;
}

export default function InfoPopup({ show, onClose, popupRef }: InfoPopupProps) {
  if (!show) return null;

  return (
    <div
      ref={popupRef}
      className="absolute bottom-full right-0 mb-2 w-72 md:w-96 max-h-96 overflow-y-auto flex items-end flex-col  p-4 bg-nord9/20 backdrop-blur-lg rounded-md shadow-xl z-50 text-nord5 text-xs leading-relaxed"
    >
      <button
        onClick={onClose}
        className="sticky top-2 right-2 p-0.5 rounded-full hover:bg-nord11 bg-nord1/80 backdrop-blur-lg  z-100 "
        aria-label="Close info"
      >
        <CloseIcon />
      </button>
      <div>
        <h3 className="font-semibold text-nord8 text-sm mb-2">Editor Information</h3>
        <p className="mb-1">
          <strong className="text-nord7">Focus Editor:</strong> Tryk <kbd>i</kbd> for hurtigt at fokusere
          Markdown-editoren.
        </p>
        <p className="mb-1">
          <strong className="text-nord7">Slet alt indhold:</strong> Tryk <kbd>ggdG</kbd> for
          hurtigt at slette alt indhold
        </p>

        <ul className="mb-1">
          <strong className="text-nord7">Vim-tilstand:</strong> Grundlæggende Vim-tastaturgenveje er aktiveret.
          <li>
            <kbd>Esc</kbd>
          </li>
          <li>
            <kbd>i</kbd>
          </li>
          <li>
            <kbd>:w</kbd> for at gemme .md
          </li>
          <li>
            <kbd>:ws</kbd> for at gemme slides,{" "}
          </li>
          <li>
            <kbd>:u</kbd> for at uploade
          </li>
          <li>
            <kbd>:p</kbd> for at forhåndsvise
          </li>
          <li>
            <kbd>:page</kbd> for at slå sidetal til/fra
          </li>
          <li>
            <kbd>:h</kbd> for at tilføje sidehoved/sidefod
          </li>
          <li>
            <kbd>:t</kbd> for at skifte til næste tema
          </li>
          <li>
            <kbd>:f</kbd> for at skifte til næste skrifttype {/* Ny Vim-kommando */}
          </li>
        </ul>
        <p className="mb-1">
          <strong className="text-nord7">Slide-oprettelse:</strong> Brug Markdown-overskrifter
          <code className="">#</code>, <code className="">##</code> for nye slides.
        </p>
        <p className="mb-1">
          <strong className="text-nord7">Live-forhåndsvisning:</strong> Viser den aktuelle slide.
        </p>
        <p>
          <strong className="text-nord7">Eksport:</strong> Brug knapperne i sidehovedet eller Vim-kommandoer.
        </p>
        <p>For mere information om, hvordan du bruger md Presentation, tjek</p> {/* Changed */}
        <a href="https://github.com/dijith-481/mdpresentation" className="text-nord9 underline text-xs"> {/* Changed URL */}
          Github readme.
        </a>
      </div>
    </div>
  );
}

