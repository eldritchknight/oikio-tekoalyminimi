// Survey data types
export interface SurveyOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface SurveyInterpretation {
  A_B: string;
  C_D: string;
}

export interface SurveyPledge {
  timeframe: string;
  choices: string[];
}

export interface SurveyField {
  id: string;
  title: string;
  theme: string;
  situation: string;
  hallucination_example?: string;
  prompt: string;
  options: SurveyOption[];
  interpretation: SurveyInterpretation;
  recommendation_title: string;
  recommendation: string;
  pledge: SurveyPledge;
  optional_end_screen?: string[];
}

export interface SurveyData {
  version: string;
  language: string;
  type: string;
  fields: {
    selection_prompt: string;
    pledge_title: string;
  };
  levels_note: string;
  gameboard: SurveyField[];
}

// UI Texts types
export interface HelpCommand {
  command: string;
  description: string;
}

export interface UiTexts {
  boot: {
    title: string;
    asciiLogo?: string[];
    lines: string[];
    buttons: string[];
  };
  help: {
    title: string;
    commands: HelpCommand[];
  };
  hub: {
    title: string;
    description: string;
    status: {
      completed: string;
      notCompleted: string;
    };
  };
  field: {
    selectionPrompt: string;
    observationTitle: string;
    recommendationTitle: string;
    recommendationSubtitle: string;
  };
  pledge: {
    title: string;
    description: string[];
    buttons: {
      save: string;
      skip: string;
    };
  };
  summary: {
    title: string;
    description: string[];
  };
  export: {
    title: string;
    description: string[];
  };
  reset: {
    title: string;
    description: string[];
    buttons: {
      confirm: string;
      cancel: string;
    };
  };
  endScreen: {
    lines: string[];
  };
}

// App state types
export type OptionKey = 'A' | 'B' | 'C' | 'D';
export type InterpretationGroup = 'A_B' | 'C_D';

export interface AppState {
  answers: Record<string, OptionKey>;
  pledges: Record<string, string[]>;
  updatedAt: string;
}

export type ViewMode = 'boot' | 'hub' | 'field' | 'summary' | 'help' | 'reset';

export interface TerminalLine {
  id: string;
  type: 'system' | 'user' | 'error' | 'success' | 'highlight';
  content: string | React.ReactNode;
}

// Export data type
export interface ExportData {
  version: string;
  exportedAt: string;
  answers: Record<string, OptionKey>;
  interpretationGroup: Record<string, InterpretationGroup>;
  pledges: Record<string, string[]>;
}
