import React, { useState, useCallback, useEffect } from 'react';
import type { UiTexts, SurveyData, AppState, ViewMode, TerminalLine, OptionKey } from '../types';
import {
  loadState,
  saveState,
  clearState,
  setAnswer,
  setPledges,
  hasCelebrationBeenShown,
  markCelebrationShown,
  clearCelebrationFlag,
} from '../state/storage';
import { generateExportData, downloadExport } from '../state/exportData';
import { parseCommand } from '../terminal/commandRouter';
import { TerminalHistory } from './TerminalHistory';
import { CommandInput } from './CommandInput';
import { CelebrationOverlay } from './CelebrationOverlay';
import { BootView } from '../views/BootView';
import { HelpView } from '../views/HelpView';
import { HubView } from '../views/HubView';
import { FieldView } from '../views/FieldView';
import { SummaryView } from '../views/SummaryView';
import { ResetView } from '../views/ResetView';

interface Props {
  uiTexts: UiTexts;
  surveyData: SurveyData;
}

let lineIdCounter = 0;
function generateLineId(): string {
  return `line-${++lineIdCounter}`;
}

export function TerminalShell({ uiTexts, surveyData }: Props) {
  const [appState, setAppState] = useState<AppState>(loadState);
  const [view, setView] = useState<ViewMode>('boot');
  const [currentFieldIndex, setCurrentFieldIndex] = useState<number>(0);
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const totalFields = surveyData.gameboard.length;

  // Persist state changes
  useEffect(() => {
    saveState(appState);
  }, [appState]);

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
    setView('summary');
  }, []);

  // Helper to check and trigger celebration after answer is set
  const checkAndTriggerCelebration = useCallback((newState: AppState) => {
    const completedCount = Object.keys(newState.answers).length;
    const allCompleted = completedCount === totalFields;

    if (allCompleted && !hasCelebrationBeenShown()) {
      markCelebrationShown();
      // Use setTimeout to avoid synchronous state updates
      setTimeout(() => setShowCelebration(true), 0);
    }
  }, [totalFields]);

  const addToHistory = useCallback((content: string | React.ReactNode, type: TerminalLine['type'] = 'system') => {
    setHistory((prev) => [...prev, { id: generateLineId(), type, content }]);
  }, []);

  const addUserCommand = useCallback((command: string) => {
    addToHistory(command, 'user');
  }, [addToHistory]);

  // Navigate to a view
  const navigateTo = useCallback((target: ViewMode, fieldIndex?: number) => {
    if (target === 'field' && fieldIndex !== undefined && fieldIndex >= 0) {
      setCurrentFieldIndex(fieldIndex);
    }
    setView(target);
  }, []);

  // Handle option selection in field view
  const handleSelectOption = useCallback((option: OptionKey) => {
    const field = surveyData.gameboard[currentFieldIndex];
    const newState = setAnswer(appState, field.id, option);
    setAppState(newState);
    addToHistory(`Valitsit vaihtoehdon ${option}`, 'success');
    checkAndTriggerCelebration(newState);
  }, [appState, currentFieldIndex, surveyData.gameboard, addToHistory, checkAndTriggerCelebration]);

  // Handle pledge save
  const handleSavePledges = useCallback((pledges: string[]) => {
    const field = surveyData.gameboard[currentFieldIndex];
    const newState = setPledges(appState, field.id, pledges);
    setAppState(newState);
    addToHistory(`Tallensit ${pledges.length} kokeilulupausta`, 'success');
  }, [appState, currentFieldIndex, surveyData.gameboard, addToHistory]);

  // Handle pledge skip
  const handleSkipPledge = useCallback(() => {
    const field = surveyData.gameboard[currentFieldIndex];
    const newState = setPledges(appState, field.id, []);
    setAppState(newState);
    addToHistory('Ohitit kokeilulupauksen', 'system');
  }, [appState, currentFieldIndex, surveyData.gameboard, addToHistory]);

  // Handle export
  const handleExport = useCallback(() => {
    const exportData = generateExportData(appState);
    downloadExport(exportData);
    addToHistory('Tulokset ladattu: oikio-ai-operator-results.json', 'success');
  }, [appState, addToHistory]);

  // Handle reset confirm
  const handleResetConfirm = useCallback(() => {
    clearState();
    clearCelebrationFlag();
    setAppState(loadState());
    addToHistory('Eteneminen nollattu', 'success');
    setView('boot');
  }, [addToHistory]);

  // Handle command input
  const handleCommand = useCallback((input: string) => {
    addUserCommand(input);

    const result = parseCommand(input, view, surveyData.gameboard.length);

    switch (result.action) {
      case 'navigate':
        if (result.target) {
          if (result.target === 'field') {
            // Handle "next" command
            if (result.fieldIndex === -1) {
              const nextIndex = currentFieldIndex + 1;
              if (nextIndex < surveyData.gameboard.length) {
                navigateTo('field', nextIndex);
              } else {
                addToHistory('Olet jo viimeisessä pelikentässä. Siirry yhteenvetoon komennolla "summary".', 'system');
              }
            } else if (result.fieldIndex !== undefined) {
              navigateTo('field', result.fieldIndex);
            } else if (result.fieldId) {
              const idx = surveyData.gameboard.findIndex((f) => f.id === result.fieldId || f.id.includes(result.fieldId!));
              if (idx >= 0) {
                navigateTo('field', idx);
              } else {
                addToHistory(`Kenttää "${result.fieldId}" ei löydy`, 'error');
              }
            }
          } else {
            navigateTo(result.target);
          }
        }
        break;

      case 'select':
        if (view === 'field' && result.option) {
          handleSelectOption(result.option);
        } else {
          addToHistory('Voit valita vaihtoehdon vain pelikentässä', 'error');
        }
        break;

      case 'export':
        handleExport();
        break;

      case 'reset':
        setView('reset');
        break;

      case 'reset-confirm':
        handleResetConfirm();
        break;

      case 'reset-cancel':
        addToHistory('Nollaus peruutettu', 'system');
        setView('hub');
        break;

      case 'error':
        if (result.message) {
          addToHistory(result.message, 'error');
        }
        break;

      case 'unknown':
        if (result.message) {
          addToHistory(result.message, 'error');
        }
        break;
    }
  }, [
    view,
    currentFieldIndex,
    surveyData.gameboard,
    addUserCommand,
    navigateTo,
    handleSelectOption,
    handleExport,
    handleResetConfirm,
    addToHistory,
  ]);

  // Render current view
  const renderView = () => {
    switch (view) {
      case 'boot':
        return (
          <BootView
            uiTexts={uiTexts}
            onStart={() => navigateTo('hub')}
            onHelp={() => navigateTo('help')}
          />
        );

      case 'help':
        return (
          <HelpView
            uiTexts={uiTexts}
            onBack={() => navigateTo('hub')}
          />
        );

      case 'hub':
        return (
          <HubView
            uiTexts={uiTexts}
            surveyData={surveyData}
            appState={appState}
            onSelectField={(index) => navigateTo('field', index)}
            onSummary={() => navigateTo('summary')}
          />
        );

      case 'field':
        return (
          <FieldView
            uiTexts={uiTexts}
            field={surveyData.gameboard[currentFieldIndex]}
            fieldIndex={currentFieldIndex}
            totalFields={surveyData.gameboard.length}
            appState={appState}
            onSelectOption={handleSelectOption}
            onSavePledges={handleSavePledges}
            onSkipPledge={handleSkipPledge}
            onBack={() => navigateTo('hub')}
            onNext={() => {
              if (currentFieldIndex < surveyData.gameboard.length - 1) {
                navigateTo('field', currentFieldIndex + 1);
              }
            }}
          />
        );

      case 'summary':
        return (
          <SummaryView
            uiTexts={uiTexts}
            surveyData={surveyData}
            appState={appState}
            onExport={handleExport}
            onReset={() => setView('reset')}
            onBack={() => navigateTo('hub')}
          />
        );

      case 'reset':
        return (
          <ResetView
            uiTexts={uiTexts}
            onConfirm={handleResetConfirm}
            onCancel={() => navigateTo('hub')}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="terminal-shell">
      <header className="terminal-header">
        <h1 className="terminal-title terminal-glow">{uiTexts.boot.title}</h1>
      </header>

      <div className="terminal-history" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {history.length > 0 && (
          <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--terminal-border)' }}>
            <TerminalHistory lines={history} />
          </div>
        )}

        <div style={{ flex: 1 }}>
          {renderView()}
        </div>
      </div>

      <CommandInput onCommand={handleCommand} />

      {/* Celebration overlay */}
      {showCelebration && (
        <CelebrationOverlay onComplete={handleCelebrationComplete} />
      )}
    </div>
  );
}
