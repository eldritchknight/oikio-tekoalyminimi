import type { UiTexts } from '../types';

interface Props {
  uiTexts: UiTexts;
  onStart: () => void;
  onHelp: () => void;
}

export function BootView({ uiTexts, onStart, onHelp }: Props) {
  const { boot } = uiTexts;

  return (
    <div className="boot-view" role="main">
      <h1 className="terminal-title terminal-glow" style={{ marginBottom: '24px' }}>
        {boot.title}
      </h1>

      <div style={{ marginBottom: '24px' }}>
        {boot.lines.map((line, index) => (
          <div key={index} className={line === '' ? 'terminal-line' : 'terminal-line terminal-line--system'}>
            {line || '\u00A0'}
          </div>
        ))}
      </div>

      <div className="terminal-buttons">
        {boot.buttons.map((btn) => (
          <button
            key={btn}
            className={`terminal-button ${btn === 'START' ? 'terminal-button--primary' : ''}`}
            onClick={btn === 'START' ? onStart : onHelp}
            aria-label={btn === 'START' ? 'Aloita kokemus' : 'Näytä ohje'}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}
