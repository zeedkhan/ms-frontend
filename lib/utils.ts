import { UPLOAD_ROUTES } from "@/routes"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* 
  Remove extra slashes from the url
  Example: https://example.com//path => https://example.com/path
*/
export const removeExtraSlashes = (url: string) => {
  const [protocol, ...rest] = url.split('://');
  const restOfUrl = rest.join('://');
  const cleanedRest = restOfUrl.replace(/\/{2,}/g, '/');
  return `${protocol}://${cleanedRest}`;
}

export const downloadBlob = (blob: Blob) => {
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = `Audio_${new Date().getMilliseconds()}.mp3`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

/* 
  Connect the path of the file to our upload service
  If we don't have the file return the default
*/
export function getFile(url: string | null = null, defaultPath: string) {
  if (!url) {
    return defaultPath
  }
  const img = UPLOAD_ROUTES.stroageDomain + "/" + url;
  return removeExtraSlashes(img)
}

export function openFileStorage(id: string) {
  const path = process.env.NEXT_PUBLIC_DOMAIN + "/file/" + id;
  return removeExtraSlashes(path)
}

export const waitForElm = (selector: string) => {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

export const elementIsVisibleInViewport = (el: Element | null, partiallyVisible = false) => {
  if (!el) return false;
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return partiallyVisible
    ? ((top > 0 && top < innerHeight) ||
      (bottom > 0 && bottom < innerHeight)) &&
    ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

export const isImage = (fileName: string) => {
  return /\.(jpe?g|png|gif|bmp|tiff|webp)(\?.*)?$/i.test(fileName);
};

export const isVideo = (fileName: string) => {
  return /\.(mp4|webm|ogg|ogv)(\?.*)?$/i.test(fileName);
};

export const isPDF = (fileName: string): boolean => {
  return /\.pdf(\?.*)?$/i.test(fileName);
};

export const isHTML = (fileName: string): boolean => {
  return /\.(html?|xhtml)(\?.*)?$/i.test(fileName);
};

export async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type: 'image/png' });
}

/**
 * Sanitizes a URL by replacing spaces with '%20'
 * @param url - The URL to sanitize
 * @returns The sanitized URL
 */
export function sanitizeUrl(url: string): string {
  return url.replace(/\s+/g, '%20')
}