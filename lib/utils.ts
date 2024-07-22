import { UPLOAD_ROUTES } from "@/routes"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* 
  Connect the path of the file to our upload service
  If we don't have the file return the default
*/
export function getFile(url: string | null = null, defaultPath: string) {
  if (!url) {
    return defaultPath
  }
  const img = UPLOAD_ROUTES.stroageDomain + "/" + url;
  return img

}