import { useState, useRef, useEffect, useCallback } from 'react';
import type { UiTexts, SurveyData, AppState } from '../types';
import { isFieldCompleted } from '../state/storage';

interface Props {
  uiTexts: UiTexts;
  surveyData: SurveyData;
  appState: AppState;
  onSelectField: (index: number) => void;
  onSummary: () => void;
}

export function HubView({ uiTexts, surveyData, appState, onSelectField, onSummary }: Props) {
  const { hub } = uiTexts;
  const { gameboard } = surveyData;

  const completedCount = Object.keys(appState.answers).length;
  const totalFields = gameboard.length;

  // Roving tabindex state
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Focus the active item when activeIndex changes
  useEffect(() => {
    itemRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, totalFields - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(totalFields - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelectField(index);
        break;
    }
  }, [totalFields, onSelectField]);

  return (
    <div className="hub-view" role="main">
      <h2 className="terminal-section-header">{hub.title}</h2>
      <p className="text-dim" style={{ marginBottom: '16px' }}>{hub.description}</p>

      <div style={{ marginBottom: '16px' }}>
        <span className="text-cyan">Eteneminen: </span>
        <span>{completedCount}/{totalFields} kalibroitu</span>
      </div>

      <div
        className="terminal-field-list"
        role="listbox"
        aria-label="Pelikentät"
        aria-activedescendant={`field-item-${activeIndex}`}
      >
        {gameboard.map((field, index) => {
          const completed = isFieldCompleted(appState, field.id);
          const fieldNumber = index + 1;
          const isActive = index === activeIndex;

          return (
            <div
              key={field.id}
              id={`field-item-${index}`}
              ref={(el) => { itemRefs.current[index] = el; }}
              className={`terminal-field-item ${isActive ? 'terminal-field-item--active' : ''}`}
              role="option"
              tabIndex={isActive ? 0 : -1}
              aria-selected={isActive}
              onClick={() => onSelectField(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setActiveIndex(index)}
              aria-label={`Pelikenttä ${fieldNumber}: ${field.title}. ${completed ? 'Kalibroitu' : 'Ei vielä käsitelty'}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <span className="terminal-field-number">[{fieldNumber}]</span>
                <span className="terminal-field-title">{field.title}</span>
              </div>
              <span className={`terminal-field-status ${completed ? 'terminal-field-status--completed' : 'terminal-field-status--pending'}`}>
                {completed ? hub.status.completed : hub.status.notCompleted}
              </span>
            </div>
          );
        })}
      </div>

      {completedCount > 0 && (
        <div className="terminal-buttons" style={{ marginTop: '24px' }}>
          <button
            className="terminal-button terminal-button--primary"
            onClick={onSummary}
            aria-label="Näytä yhteenveto"
          >
            YHTEENVETO
          </button>
        </div>
      )}
    </div>
  );
}
