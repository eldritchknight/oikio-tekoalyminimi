import { useState, useMemo, useRef, useEffect } from 'react';
import type { UiTexts, SurveyField, AppState, OptionKey } from '../types';
import { getInterpretationGroup } from '../state/storage';

interface Props {
  uiTexts: UiTexts;
  field: SurveyField;
  fieldIndex: number;
  totalFields: number;
  appState: AppState;
  onSelectOption: (option: OptionKey) => void;
  onSavePledges: (pledges: string[]) => void;
  onSkipPledge: () => void;
  onBack: () => void;
  onNext: () => void;
}

type Phase = 'selection' | 'observation' | 'pledge' | 'complete';

const OPTION_KEYS: OptionKey[] = ['A', 'B', 'C', 'D'];

// Inner component that resets when key changes
function FieldViewInner({
  uiTexts,
  field,
  totalFields,
  fieldIndex,
  existingAnswer,
  existingPledges,
  onSelectOption,
  onSavePledges,
  onSkipPledge,
  onBack,
  onNext,
}: {
  uiTexts: UiTexts;
  field: SurveyField;
  fieldIndex: number;
  totalFields: number;
  existingAnswer: OptionKey | undefined;
  existingPledges: string[];
  onSelectOption: (option: OptionKey) => void;
  onSavePledges: (pledges: string[]) => void;
  onSkipPledge: () => void;
  onBack: () => void;
  onNext: () => void;
}) {
  // Determine initial phase based on existing state
  const initialPhase = useMemo((): Phase => {
    if (existingAnswer && existingPledges.length > 0) return 'complete';
    if (existingAnswer) return 'pledge';
    return 'selection';
  }, [existingAnswer, existingPledges.length]);

  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [selectedOption, setSelectedOption] = useState<OptionKey | null>(existingAnswer || null);
  const [selectedPledges, setSelectedPledges] = useState<string[]>(existingPledges);

  // Arrow key navigation state for options
  const [activeOptionIndex, setActiveOptionIndex] = useState(0);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Arrow key navigation state for pledges
  const [activePledgeIndex, setActivePledgeIndex] = useState(0);
  const pledgeRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus active option when index changes in selection phase
  useEffect(() => {
    if (phase === 'selection') {
      optionRefs.current[activeOptionIndex]?.focus();
    }
  }, [activeOptionIndex, phase]);

  // Focus active pledge when index changes in pledge phase
  useEffect(() => {
    if (phase === 'pledge') {
      pledgeRefs.current[activePledgeIndex]?.focus();
    }
  }, [activePledgeIndex, phase]);

  const handleOptionSelect = (option: OptionKey) => {
    setSelectedOption(option);
    onSelectOption(option);
    setPhase('observation');

    // Auto-advance to pledge after brief delay
    setTimeout(() => {
      setPhase('pledge');
      setActivePledgeIndex(0);
    }, 100);
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent, index: number) => {
    const optionsCount = field.options.length;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        setActiveOptionIndex((prev) => (prev + 1) % optionsCount);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        setActiveOptionIndex((prev) => (prev - 1 + optionsCount) % optionsCount);
        break;
      case 'Home':
        e.preventDefault();
        setActiveOptionIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveOptionIndex(optionsCount - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleOptionSelect(field.options[index].key);
        break;
    }
  };

  const handlePledgeToggle = (pledge: string) => {
    setSelectedPledges((prev) =>
      prev.includes(pledge) ? prev.filter((p) => p !== pledge) : [...prev, pledge]
    );
  };

  const handlePledgeKeyDown = (e: React.KeyboardEvent) => {
    const pledgesCount = field.pledge.choices.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActivePledgeIndex((prev) => Math.min(prev + 1, pledgesCount - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActivePledgeIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setActivePledgeIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActivePledgeIndex(pledgesCount - 1);
        break;
      case ' ':
        // Space toggles - let default behavior handle it
        break;
    }
  };

  const handleSavePledges = () => {
    onSavePledges(selectedPledges);
    setPhase('complete');
  };

  const handleSkipPledge = () => {
    onSkipPledge();
    setPhase('complete');
  };

  const interpretationGroup = selectedOption ? getInterpretationGroup(selectedOption) : null;

  return (
    <div className="field-view" role="main">
      {/* Header */}
      <div style={{ marginBottom: '8px' }}>
        <span className="text-dim">Pelikenttä {fieldIndex + 1}/{totalFields}</span>
      </div>
      <h2 className="terminal-section-header" style={{ marginTop: 0 }}>{field.title}</h2>

      {/* Theme and situation */}
      <div className="terminal-highlight-box">
        <div className="text-cyan" style={{ marginBottom: '8px' }}>{field.theme}</div>
        <div>{field.situation}</div>
      </div>

      {/* Hallucination example if present */}
      {field.hallucination_example && (
        <div className="terminal-highlight-box terminal-highlight-box--warning">
          <div className="text-cyan" style={{ marginBottom: '8px' }}>Esimerkki:</div>
          <div>{field.hallucination_example}</div>
        </div>
      )}

      {/* Phase: Selection */}
      {phase === 'selection' && (
        <>
          <p style={{ marginTop: '16px', marginBottom: '16px' }}>
            <span className="text-cyan">{uiTexts.field.selectionPrompt}</span>
          </p>

          <div
            className="terminal-options"
            role="listbox"
            aria-label="Valitse vaihtoehto"
            aria-activedescendant={`option-${OPTION_KEYS[activeOptionIndex]}`}
          >
            {field.options.map((option, index) => {
              const isActive = index === activeOptionIndex;
              return (
                <button
                  key={option.key}
                  id={`option-${option.key}`}
                  ref={(el) => { optionRefs.current[index] = el; }}
                  className={`terminal-option ${isActive ? 'terminal-option--active' : ''}`}
                  onClick={() => handleOptionSelect(option.key)}
                  onKeyDown={(e) => handleOptionKeyDown(e, index)}
                  onFocus={() => setActiveOptionIndex(index)}
                  role="option"
                  tabIndex={isActive ? 0 : -1}
                  aria-selected={isActive}
                >
                  <span className="terminal-option-key">[{option.key}]</span>
                  <span>{option.text}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Phase: Observation/Pledge/Complete - show results */}
      {(phase === 'observation' || phase === 'pledge' || phase === 'complete') && selectedOption && (
        <>
          {/* Selected answer */}
          <div style={{ marginTop: '16px', marginBottom: '16px' }}>
            <span className="text-dim">Valitsit: </span>
            <span className="text-cyan">[{selectedOption}]</span>
          </div>

          <hr className="terminal-divider" />

          {/* Observation */}
          <h3 className="terminal-section-header">{uiTexts.field.observationTitle}</h3>
          <p>{interpretationGroup && field.interpretation[interpretationGroup]}</p>

          <hr className="terminal-divider" />

          {/* Recommendation */}
          <h3 className="terminal-section-header">{uiTexts.field.recommendationTitle}</h3>
          <p className="text-dim" style={{ marginBottom: '8px' }}>{uiTexts.field.recommendationSubtitle}</p>
          <div className="terminal-highlight-box">
            {field.recommendation}
          </div>
        </>
      )}

      {/* Phase: Pledge selection */}
      {phase === 'pledge' && (
        <>
          <hr className="terminal-divider" />

          <h3 className="terminal-section-header">{uiTexts.pledge.title}</h3>
          {uiTexts.pledge.description.map((line, i) => (
            <p key={i} className="text-dim">{line}</p>
          ))}

          <p className="text-dim" style={{ marginTop: '12px' }}>{field.pledge.timeframe}</p>

          <div className="terminal-checkbox-group" role="group" aria-label="Kokeilulupaukset">
            {field.pledge.choices.map((choice, index) => {
              const isActive = index === activePledgeIndex;
              return (
                <label
                  key={index}
                  className={`terminal-checkbox ${isActive ? 'terminal-checkbox--active' : ''}`}
                >
                  <input
                    ref={(el) => { pledgeRefs.current[index] = el; }}
                    type="checkbox"
                    checked={selectedPledges.includes(choice)}
                    onChange={() => handlePledgeToggle(choice)}
                    onKeyDown={handlePledgeKeyDown}
                    onFocus={() => setActivePledgeIndex(index)}
                    tabIndex={isActive ? 0 : -1}
                    aria-label={choice}
                  />
                  <span className="terminal-checkbox-label">{choice}</span>
                </label>
              );
            })}
          </div>

          <div className="terminal-buttons">
            <button
              className="terminal-button terminal-button--primary"
              onClick={handleSavePledges}
              disabled={selectedPledges.length === 0}
              aria-label="Tallenna valinnat"
            >
              {uiTexts.pledge.buttons.save}
            </button>
            <button
              className="terminal-button"
              onClick={handleSkipPledge}
              aria-label="Ohita ja jatka"
            >
              {uiTexts.pledge.buttons.skip}
            </button>
          </div>
        </>
      )}

      {/* Phase: Complete */}
      {phase === 'complete' && (
        <>
          {existingPledges.length > 0 && (
            <>
              <hr className="terminal-divider" />
              <h3 className="terminal-section-header">{uiTexts.pledge.title}</h3>
              <ul style={{ marginLeft: '16px' }}>
                {existingPledges.map((pledge, i) => (
                  <li key={i} className="text-success">{pledge}</li>
                ))}
              </ul>
            </>
          )}

          <hr className="terminal-divider" />

          <div className="terminal-buttons">
            <button
              className="terminal-button"
              onClick={onBack}
              aria-label="Palaa pelialueisiin"
            >
              TAKAISIN
            </button>
            {fieldIndex < totalFields - 1 && (
              <button
                className="terminal-button terminal-button--primary"
                onClick={onNext}
                aria-label="Seuraava pelikenttä"
              >
                SEURAAVA
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Wrapper that uses key to reset state when field changes
export function FieldView({
  uiTexts,
  field,
  fieldIndex,
  totalFields,
  appState,
  onSelectOption,
  onSavePledges,
  onSkipPledge,
  onBack,
  onNext,
}: Props) {
  const existingAnswer = appState.answers[field.id];
  const existingPledges = appState.pledges[field.id] || [];

  // Create a key that changes when field changes or when state updates
  const stateKey = `${field.id}-${existingAnswer || 'none'}-${existingPledges.length}`;

  return (
    <FieldViewInner
      key={stateKey}
      uiTexts={uiTexts}
      field={field}
      fieldIndex={fieldIndex}
      totalFields={totalFields}
      existingAnswer={existingAnswer}
      existingPledges={existingPledges}
      onSelectOption={onSelectOption}
      onSavePledges={onSavePledges}
      onSkipPledge={onSkipPledge}
      onBack={onBack}
      onNext={onNext}
    />
  );
}
