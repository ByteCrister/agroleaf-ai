// src/lib/cloudinary/get-images.ts
import cloudinary from "@/config/cloudinary";

interface CloudinaryImageResource {
  secure_url: string;
  // add other fields if needed
}

// Fisher‑Yates shuffle (in‑place)
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function getShuffledImageUrls(folder: string): Promise<string[]> {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folder, // e.g. 'Home/agroleaf-ai-uploads'
      max_results: 500, // enough for 50 images
    });

    console.log(result);

    // Each resource has a `secure_url` field
    const urls = result.resources.map(
      (r: CloudinaryImageResource) => r.secure_url,
    );
    return shuffleArray(urls);
  } catch (error) {
    console.error("Error fetching Cloudinary images:", error);
    return [];
  }
}
