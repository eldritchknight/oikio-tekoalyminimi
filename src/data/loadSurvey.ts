import type { SurveyData } from '../types';

let cachedSurvey: SurveyData | null = null;

export async function loadSurvey(): Promise<SurveyData> {
  if (cachedSurvey) {
    return cachedSurvey;
  }

  const response = await fetch('/assets/survey.json');
  if (!response.ok) {
    throw new Error('Failed to load survey data');
  }

  cachedSurvey = await response.json();
  return cachedSurvey as SurveyData;
}

export function getSurvey(): SurveyData | null {
  return cachedSurvey;
}
