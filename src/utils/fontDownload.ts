// src\utils\fontDownload.ts
export interface FontCache {
  inter: string | null;
  iosevka: string | null;
  diatype: string | null; // Tilføj diatype til cache
}

const fontCache: FontCache = {
  inter: null,
  iosevka: null,
  diatype: null, // Initialiser diatype
};

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

// Hent base-stien fra miljøvariabler
// Sørg for, at dette opsamles korrekt under byggeprocessen
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

async function fetchAndEncodeFont(fontPath: string): Promise<string> {
  try {
    // Konstruer den fulde URL for aktivet
    // Fjern indledende skråstreg fra fontPath, hvis den findes, for at undgå //
    const assetRelativePath = fontPath.startsWith('/') ? fontPath.substring(1) : fontPath;
    const fullUrl = `${BASE_PATH}/${assetRelativePath}`; // Sørg for, at BASE_PATH anvendes

    const response = await fetch(fullUrl); // Brug den korrigerede fulde URL
    if (!response.ok) {
      throw new Error(`Failed to fetch font from ${fullUrl}: ${response.statusText || response.status}`);
    }

    const blob = await response.blob();
    const file = new File([blob], fontPath.split("/").pop() || "");
    return await fileToBase64(file);
  } catch (error) {
    console.error(`Error encoding font from ${fontPath} (attempted URL: ${BASE_PATH}${fontPath}):`, error);
    throw error;
  }
}

export async function getEncodedFonts(): Promise<FontCache> {
  try {
    if (fontCache.inter && fontCache.iosevka && fontCache.diatype) { // Tjek alle skrifttyper
      return { ...fontCache };
    }

    const [interBase64, iosevkaBase64, diatypeBase64] = await Promise.all([ // Hent diatype
      fetchAndEncodeFont("InterVariable.woff2"),
      fetchAndEncodeFont("iosevka.woff2"),
      fetchAndEncodeFont("ABC Diatype.woff2"), // Hent den nye skrifttype
    ]);

    fontCache.inter = interBase64;
    fontCache.iosevka = iosevkaBase64;
    fontCache.diatype = diatypeBase64; // Gem diatype

    return { ...fontCache };
  } catch (error) {
    console.error("Error getting encoded fonts:", error);
    throw error;
  }
}

