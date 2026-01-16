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

  return (
    <div className="hub-view" role="main">
      <h2 className="terminal-section-header">{hub.title}</h2>
      <p className="text-dim" style={{ marginBottom: '16px' }}>{hub.description}</p>

      <div style={{ marginBottom: '16px' }}>
        <span className="text-cyan">Eteneminen: </span>
        <span>{completedCount}/{totalFields} kalibroitu</span>
      </div>

      <div className="terminal-field-list" role="list">
        {gameboard.map((field, index) => {
          const completed = isFieldCompleted(appState, field.id);
          const fieldNumber = index + 1;

          return (
            <div
              key={field.id}
              className="terminal-field-item"
              role="listitem"
              tabIndex={0}
              onClick={() => onSelectField(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectField(index);
                }
              }}
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
