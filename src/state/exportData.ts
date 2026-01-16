import type { AppState, ExportData, InterpretationGroup } from '../types';
import { getInterpretationGroup } from './storage';

export function generateExportData(state: AppState): ExportData {
  const interpretationGroup: Record<string, InterpretationGroup> = {};

  for (const [fieldId, option] of Object.entries(state.answers)) {
    interpretationGroup[fieldId] = getInterpretationGroup(option);
  }

  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    answers: state.answers,
    interpretationGroup,
    pledges: state.pledges,
  };
}

export function downloadExport(data: ExportData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'oikio-ai-operator-results.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
