import type { UiTexts } from '../types';

let cachedUiTexts: UiTexts | null = null;

export async function loadUiTexts(): Promise<UiTexts> {
  if (cachedUiTexts) {
    return cachedUiTexts;
  }

  const response = await fetch('/assets/ui-texts.json');
  if (!response.ok) {
    throw new Error('Failed to load UI texts');
  }

  cachedUiTexts = await response.json();
  return cachedUiTexts as UiTexts;
}

export function getUiTexts(): UiTexts | null {
  return cachedUiTexts;
}
