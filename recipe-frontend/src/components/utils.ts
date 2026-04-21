import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API_URL = import.meta.env.DEV ? 'http://localhost:4000/api' : 'https://recipe-app-rsdr.onrender.com/api'
export const S3_URL = "https://stovetop.cc"
