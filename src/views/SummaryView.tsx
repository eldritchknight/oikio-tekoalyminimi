import type { UiTexts, SurveyData, AppState } from '../types';
import { getInterpretationGroup } from '../state/storage';

interface Props {
  uiTexts: UiTexts;
  surveyData: SurveyData;
  appState: AppState;
  onExport: () => void;
  onReset: () => void;
  onBack: () => void;
}

export function SummaryView({ uiTexts, surveyData, appState, onExport, onReset, onBack }: Props) {
  const { summary, endScreen } = uiTexts;
  const { gameboard } = surveyData;

  const completedCount = Object.keys(appState.answers).length;
  const totalFields = gameboard.length;

  // Collect all pledges
  const allPledges: { fieldTitle: string; pledges: string[] }[] = [];
  for (const field of gameboard) {
    const pledges = appState.pledges[field.id];
    if (pledges && pledges.length > 0) {
      allPledges.push({
        fieldTitle: field.title,
        pledges,
      });
    }
  }

  // Get optional end screen from field_06
  const field06 = gameboard.find((f) => f.id.includes('field_06'));
  const optionalEndScreen = field06?.optional_end_screen;

  return (
    <div className="summary-view" role="main">
      <h2 className="terminal-section-header">{summary.title}</h2>

      {summary.description.map((line, i) => (
        <p key={i} className={line === '' ? '' : 'text-dim'}>{line || '\u00A0'}</p>
      ))}

      <hr className="terminal-divider" />

      {/* Completion status */}
      <div style={{ marginBottom: '16px' }}>
        <span className="text-cyan">Eteneminen: </span>
        <span className={completedCount === totalFields ? 'text-success' : ''}>
          {completedCount}/{totalFields} pelikenttää kalibroitu
        </span>
      </div>

      {/* Field answers */}
      <h3 className="terminal-section-header">VALINTASI</h3>
      <div style={{ marginBottom: '24px' }}>
        {gameboard.map((field, index) => {
          const answer = appState.answers[field.id];
          if (!answer) return null;

          const group = getInterpretationGroup(answer);

          return (
            <div key={field.id} style={{ marginBottom: '12px' }}>
              <div>
                <span className="text-cyan">[{index + 1}] </span>
                <span>{field.title}</span>
              </div>
              <div style={{ marginLeft: '24px' }}>
                <span className="text-dim">Valinta: </span>
                <span className="text-cyan">{answer}</span>
                <span className="text-dim"> ({group === 'A_B' ? 'A–B ryhmä' : 'C–D ryhmä'})</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pledges */}
      {allPledges.length > 0 && (
        <>
          <h3 className="terminal-section-header">KOKEILULUPAUKSESI</h3>
          <div style={{ marginBottom: '24px' }}>
            {allPledges.map((item, i) => (
              <div key={i} style={{ marginBottom: '12px' }}>
                <div className="text-cyan">{item.fieldTitle}</div>
                <ul style={{ marginLeft: '16px', marginTop: '4px' }}>
                  {item.pledges.map((pledge, j) => (
                    <li key={j} className="text-success">{pledge}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      <hr className="terminal-divider" />

      {/* End screen */}
      <div className="terminal-highlight-box" style={{ marginBottom: '24px' }}>
        {endScreen.lines.map((line, i) => (
          <p key={i} style={{ margin: line === '' ? '12px 0' : '4px 0' }}>{line || '\u00A0'}</p>
        ))}

        {optionalEndScreen && (
          <>
            <hr className="terminal-divider" style={{ margin: '16px 0' }} />
            {optionalEndScreen.map((line, i) => (
              <p key={`opt-${i}`} style={{ margin: '4px 0' }}>{line}</p>
            ))}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="terminal-buttons">
        <button
          className="terminal-button terminal-button--primary"
          onClick={onExport}
          aria-label="Lataa valinnat JSON-tiedostona"
        >
          LATAA TULOKSET
        </button>
        <button
          className="terminal-button"
          onClick={onBack}
          aria-label="Palaa pelialueisiin"
        >
          TAKAISIN
        </button>
        <button
          className="terminal-button terminal-button--danger"
          onClick={onReset}
          aria-label="Nollaa eteneminen"
        >
          NOLLAA
        </button>
      </div>
    </div>
  );
}
