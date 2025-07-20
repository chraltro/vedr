// src\utils\fontDownload.ts
export interface FontCache {
  inter: string | null;
  iosevka: string | null;
  diatype: string | null;
  satoshi: string | null;
}

const fontCache: FontCache = {
  inter: null,
  iosevka: null,
  diatype: null,
  satoshi: null,
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

async function fetchAndEncodeFont(fontPath: string): Promise<string | null> { // Return null on error
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
      console.error(`Failed to fetch font from ${fullUrl}: ${response.statusText || response.status}`);
      return null; // Return null instead of throwing
    }

    const blob = await response.blob();
    const file = new File([blob], fontPath.split("/").pop() || "");
    const base64 = await fileToBase64(file);
    console.log(`Successfully fetched and encoded font: ${fontPath}`); // Add this log
    return base64;
  } catch (error) {
    // Log the fullUrl that was attempted, which is now correctly constructed
    console.error(`Error encoding font from ${fontPath} (attempted URL: ${fullUrl}):`, error);
    return null; // Return null on any other error during fetch/encode
  }
}

export async function getEncodedFonts(): Promise<FontCache> {
  try {
    // Log the BASE_PATH to help debug deployment issues
    console.log(`Current BASE_PATH: ${BASE_PATH}`);

    if (fontCache.inter && fontCache.iosevka && fontCache.diatype && fontCache.satoshi) { // Check all fonts
      return { ...fontCache };
    }

    const [interBase64, iosevkaBase64, diatypeBase64, satoshiBase64] = await Promise.all([
      fetchAndEncodeFont("InterVariable.woff2"),
      fetchAndEncodeFont("iosevka.woff2"),
      fetchAndEncodeFont("abcdiatype.woff2"),
      fetchAndEncodeFont("satoshi.woff2"),
    ]);

    fontCache.inter = interBase64;
    fontCache.iosevka = iosevkaBase64;
    fontCache.diatype = diatypeBase64;
    fontCache.satoshi = satoshiBase64;

    return { ...fontCache };
  } catch (error) {
    // This catch block will now only be hit if Promise.all itself fails,
    // not if an individual font fetch returns null.
    console.error("Error getting encoded fonts:", error);
    // You might want to return a partial cache or re-throw if this is a critical failure
    throw error; // Re-throwing for now, as it indicates a deeper issue than just one missing font
  }
}

