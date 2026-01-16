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
      {/* ASCII Logo */}
      {boot.asciiLogo && boot.asciiLogo.length > 0 && (
        <pre className="boot-ascii-logo boot-fade boot-fade--logo" aria-label="OIKIO logo">
          {boot.asciiLogo.join('\n')}
        </pre>
      )}

      {/* Boot text lines */}
      <div className="boot-text boot-fade boot-fade--text">
        {boot.lines.map((line, index) => (
          <div key={index} className={line === '' ? 'terminal-line' : 'terminal-line terminal-line--system'}>
            {line || '\u00A0'}
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="terminal-buttons boot-fade boot-fade--buttons">
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
