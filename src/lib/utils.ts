import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveImageUrl(image: string): string {
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";
  const apiRoot = baseURL.replace(/\/api\/v\d+\/?$/, "");
  return `${apiRoot}/api/static/${image}`;
}
