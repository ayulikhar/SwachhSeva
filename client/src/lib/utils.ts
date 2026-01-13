import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(blob);
  });
}

export const SEVERITY_COLORS = {
  LOW: "bg-emerald-100 text-emerald-800 border-emerald-200",
  MEDIUM: "bg-amber-100 text-amber-800 border-amber-200",
  HIGH: "bg-rose-100 text-rose-800 border-rose-200",
};

export const SEVERITY_LABELS = {
  LOW: "Low Priority",
  MEDIUM: "Medium Priority",
  HIGH: "Critical",
};
