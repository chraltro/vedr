// src\utils\fontDownload.ts
export interface FontCache {
  inter: string | null;
  iosevka: string | null;
}

const fontCache: FontCache = {
  inter: null,
  iosevka: null,
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

// Get the base path from environment variables
// Ensure this is properly picked up during the build process
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

async function fetchAndEncodeFont(fontPath: string): Promise<string> {
  try {
    // Construct the full URL for the asset
    // Trim leading slash from fontPath if it exists to avoid //
    const assetRelativePath = fontPath.startsWith('/') ? fontPath.substring(1) : fontPath;
    const fullUrl = `${BASE_PATH}/${assetRelativePath}`; // Ensure BASE_PATH is applied

    const response = await fetch(fullUrl); // Use the corrected full URL
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
    if (fontCache.inter && fontCache.iosevka) {
      return { ...fontCache };
    }

    const [interBase64, iosevkaBase64] = await Promise.all([
      // Pass relative paths as they are here, the fetchAndEncodeFont will handle prepending BASE_PATH
      fetchAndEncodeFont("InterVariable.woff2"), // No leading slash
      fetchAndEncodeFont("iosevka.woff2"),       // No leading slash
    ]);

    fontCache.inter = interBase64;
    fontCache.iosevka = iosevkaBase64;

    return { ...fontCache };
  } catch (error) {
    console.error("Error getting encoded fonts:", error);
    throw error;
  }
}