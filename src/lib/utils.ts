import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gets a boolean value from a URL query parameter.
 * @param key The query parameter key to look for
 * @param defaultValue The default value to return if the parameter is not found
 * @returns The boolean value of the query parameter
 */
export function getQueryParamBoolean(key: string, defaultValue: boolean = false): boolean {
  if (typeof window === 'undefined') return defaultValue;
  
  const params = new URLSearchParams(window.location.search);
  const value = params.get(key);
  
  if (value === null) return defaultValue;
  
  // Convert various truthy/falsy string values to boolean
  const truthyValues = ['true', '1', 'yes', 'y', 'on'];
  return truthyValues.includes(value.toLowerCase());
}
