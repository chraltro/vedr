// src\utils\fontDownload.ts
export interface FontCache {
  inter: string | null;
  iosevka: string | null;
  diatype: string | null; // Add diatype to cache
}

const fontCache: FontCache = {
  inter: null,
  iosevka: null,
  diatype: null, // Initialize diatype
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

// Get base path from environment variables
// Ensure this is correctly picked up during the build process
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

async function fetchAndEncodeFont(fontPath: string): Promise<string> {
  let fullUrl = ''; // Declare fullUrl here
  try {
    // Construct the full URL for the asset
    // Remove leading slash from fontPath if it exists, to avoid //
    const assetRelativePath = fontPath.startsWith('/') ? fontPath.substring(1) : fontPath;
    // Explicitly encode the path segment to handle spaces and other special characters
    const encodedAssetRelativePath = encodeURIComponent(assetRelativePath);
    fullUrl = `${BASE_PATH}/${encodedAssetRelativePath}`; // Ensure BASE_PATH is applied

    console.log(`Attempting to fetch font from: ${fullUrl}`); // Log the actual URL being fetched

    const response = await fetch(fullUrl); // Use the corrected full URL
    if (!response.ok) {
      throw new Error(`Failed to fetch font from ${fullUrl}: ${response.statusText || response.status}`);
    }

    const blob = await response.blob();
    const file = new File([blob], fontPath.split("/").pop() || "");
    const base64 = await fileToBase64(file);
    console.log(`Successfully fetched and encoded font: ${fontPath}`); // Add this log
    return base64;
  } catch (error) {
    // Log the fullUrl that was attempted, which is now correctly constructed
    console.error(`Error encoding font from ${fontPath} (attempted URL: ${fullUrl}):`, error);
    throw error;
  }
}

export async function getEncodedFonts(): Promise<FontCache> {
  try {
    // Log the BASE_PATH to help debug deployment issues
    console.log(`Current BASE_PATH: ${BASE_PATH}`);

    if (fontCache.inter && fontCache.iosevka && fontCache.diatype) { // Check all fonts
      return { ...fontCache };
    }

    const [interBase64, iosevkaBase64, diatypeBase64] = await Promise.all([ // Get diatype
      fetchAndEncodeFont("InterVariable.woff2"),
      fetchAndEncodeFont("iosevka.woff2"),
      fetchAndEncodeFont("ABC Diatype.woff2"), // Get the new font
    ]);

    fontCache.inter = interBase64;
    fontCache.iosevka = iosevkaBase64;
    fontCache.diatype = diatypeBase64; // Store diatype

    return { ...fontCache };
  } catch (error) {
    console.error("Error getting encoded fonts:", error);
    throw error;
  }
}

