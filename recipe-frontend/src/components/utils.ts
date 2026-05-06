import clsx from "clsx"
import type ClassValue from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API_URL = import.meta.env.DEV ? 'http://localhost:4000/api' : 'https://recipe-app-rsdr.onrender.com/api'

export const S3_URL = "https://stovetop.cc"

export const IMAGES_URL = `${S3_URL}/content/`

export function getURLParams() {
	const urlSearchParams = new URLSearchParams(window.location.search);
	return Object.fromEntries(urlSearchParams.entries());
}

export function getImgSrc(src: string) {
	if (!src.startsWith('http')) {
		return `${IMAGES_URL}${src}`
	}
	return src
}

