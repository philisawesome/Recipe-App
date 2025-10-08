import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type User = {
	username: string
	name: string
}

export const MockUser: User = {
	username: 'Linecook',
	name: 'Link',
}
