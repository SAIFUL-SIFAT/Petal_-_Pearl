import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Use a distinct key to prevent collision
const HEALTH_CHECK_KEY = 'health_check_timestamp';
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const verifyHealth = async () => {
  const lastCheck = sessionStorage.getItem(HEALTH_CHECK_KEY);
  const now = Date.now();

  // If checked recently (within 5 mins), skip to avoid spamming
  if (lastCheck && now - parseInt(lastCheck) < CHECK_INTERVAL) {
    return;
  }

  try {
    // Assuming /api proxy is set up or using full URL.
    // We try to stick to relative if possible, or use import.meta.env
    // For now we'll try a relative path assuming typical proxy setup or direct fetch if base URL is known.
    // If you have a specific ENV for backend, use it.
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    await fetch(`${backendUrl}/health`);
    sessionStorage.setItem(HEALTH_CHECK_KEY, now.toString());
  } catch (err) {
    // Silent fail - we don't want to block UI for a background warmup
    console.error("Wake-up call failed", err);
  }
};

export const getOptimizedImageUrl = (
  items: string | undefined,
  transformation: 'list' | 'detail' | 'thumb' = 'list'
) => {
  if (!items) return "/placeholder.svg";

  // Check if it's a Cloudinary URL
  if (items.includes('cloudinary.com')) {
    // Insert transformations after /upload/
    // Common pattern: .../upload/v12345/folder/id.jpg
    // We want: .../upload/f_auto,q_auto,w_600,c_fill/v12345/folder/id.jpg

    // Define configs
    const configs = {
      list: 'f_auto,q_auto,w_600,c_fill',   // Product Grid
      detail: 'f_auto,q_auto,w_1200',       // Product Page
      thumb: 'f_auto,q_auto,w_200,c_fill'   // Cart/Mini views
    };

    const params = configs[transformation];

    // Avoid double optimization if already present
    if (items.includes('f_auto,q_auto')) return items;

    return items.replace('/upload/', `/upload/${params}/`);
  }

  // If it's just a raw public_id (no slashes, no dots usually, but could be deep), 
  // AND we know the cloud name, we could construct it. 
  // But without cloud name hardcoded, we assume full URL is passed mostly.
  // If the user strictly saves public_id now, we would need the cloud name here.
  // We will assume for now we are dealing with full URLs or we fallback to the input.

  return items;
};



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
