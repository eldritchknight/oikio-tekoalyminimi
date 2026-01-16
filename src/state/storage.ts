import type { AppState, OptionKey, InterpretationGroup } from '../types';

const STORAGE_KEY = 'oikio-ai-operator-state';

const initialState: AppState = {
  answers: {},
  pledges: {},
  updatedAt: new Date().toISOString(),
};

export function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        answers: parsed.answers || {},
        pledges: parsed.pledges || {},
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      };
    }
  } catch (e) {
    console.error('Failed to load state from localStorage:', e);
  }
  return { ...initialState };
}

export function saveState(state: AppState): void {
  try {
    const toSave: AppState = {
      ...state,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear state from localStorage:', e);
  }
}

export function setAnswer(state: AppState, fieldId: string, option: OptionKey): AppState {
  return {
    ...state,
    answers: {
      ...state.answers,
      [fieldId]: option,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function setPledges(state: AppState, fieldId: string, pledges: string[]): AppState {
  return {
    ...state,
    pledges: {
      ...state.pledges,
      [fieldId]: pledges,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function getInterpretationGroup(option: OptionKey): InterpretationGroup {
  return option === 'A' || option === 'B' ? 'A_B' : 'C_D';
}

export function getCompletedFieldsCount(state: AppState): number {
  return Object.keys(state.answers).length;
}

export function isFieldCompleted(state: AppState, fieldId: string): boolean {
  return fieldId in state.answers;
}
