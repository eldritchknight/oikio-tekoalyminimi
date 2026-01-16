import type { ViewMode, OptionKey } from '../types';

export interface CommandResult {
  action: 'navigate' | 'select' | 'export' | 'reset' | 'reset-confirm' | 'reset-cancel' | 'error' | 'unknown';
  target?: ViewMode;
  fieldIndex?: number;
  fieldId?: string;
  option?: OptionKey;
  message?: string;
}

export function parseCommand(input: string, currentView: ViewMode, totalFields: number): CommandResult {
  const trimmed = input.trim().toLowerCase();
  const parts = trimmed.split(/\s+/);
  const command = parts[0];
  const arg = parts[1];

  // Global commands
  switch (command) {
    case 'start':
      return { action: 'navigate', target: 'hub' };

    case 'help':
      return { action: 'navigate', target: 'help' };

    case 'fields':
    case 'hub':
      return { action: 'navigate', target: 'hub' };

    case 'status':
      return { action: 'navigate', target: 'hub' };

    case 'summary':
      return { action: 'navigate', target: 'summary' };

    case 'export':
      return { action: 'export' };

    case 'reset':
      return { action: 'reset' };

    case 'restart':
      return { action: 'reset' };

    case 'back':
      if (currentView === 'field' || currentView === 'summary' || currentView === 'help') {
        return { action: 'navigate', target: 'hub' };
      }
      if (currentView === 'hub') {
        return { action: 'navigate', target: 'boot' };
      }
      return { action: 'error', message: 'Ei aiempaa näkymää' };

    case 'enter': {
      if (!arg) {
        return { action: 'error', message: 'Käytä: enter <numero>' };
      }
      // Try to parse as number
      const num = parseInt(arg, 10);
      if (!isNaN(num) && num >= 1 && num <= totalFields) {
        return { action: 'navigate', target: 'field', fieldIndex: num - 1 };
      }
      // Try to match as field ID prefix
      if (arg.startsWith('field_')) {
        return { action: 'navigate', target: 'field', fieldId: arg };
      }
      return { action: 'error', message: `Kenttää "${arg}" ei löydy. Käytä numeroa 1-${totalFields}.` };
    }

    // Option selection (field view)
    case 'a':
    case 'b':
    case 'c':
    case 'd':
      return { action: 'select', option: command.toUpperCase() as OptionKey };

    case 'choose':
    case 'valitse':
      if (arg && ['a', 'b', 'c', 'd'].includes(arg.toLowerCase())) {
        return { action: 'select', option: arg.toUpperCase() as OptionKey };
      }
      return { action: 'error', message: 'Käytä: choose <A/B/C/D>' };

    case 'next':
      // This is handled by the view itself since it needs current field context
      return { action: 'navigate', target: 'field', fieldIndex: -1 }; // Special marker for "next"

    // Reset confirmation
    case 'kyllä':
    case 'yes':
    case 'confirm':
      if (currentView === 'reset') {
        return { action: 'reset-confirm' };
      }
      return { action: 'unknown' };

    case 'peruuta':
    case 'cancel':
    case 'no':
      if (currentView === 'reset') {
        return { action: 'reset-cancel' };
      }
      return { action: 'unknown' };

    default:
      if (trimmed === '') {
        return { action: 'unknown' };
      }
      return { action: 'unknown', message: `Tuntematon komento: "${command}". Kirjoita "help" nähdäksesi komennot.` };
  }
}
