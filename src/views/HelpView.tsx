import type { UiTexts } from '../types';

interface Props {
  uiTexts: UiTexts;
  onBack: () => void;
}

export function HelpView({ uiTexts, onBack }: Props) {
  const { help } = uiTexts;

  return (
    <div className="help-view" role="main">
      <h2 className="terminal-section-header">{help.title}</h2>

      <div style={{ marginTop: '16px' }}>
        {help.commands.map((cmd, index) => (
          <div key={index} style={{ marginBottom: '8px' }}>
            <span className="text-cyan" style={{ display: 'inline-block', minWidth: '120px' }}>
              {cmd.command}
            </span>
            <span className="text-dim">{cmd.description}</span>
          </div>
        ))}
      </div>

      <div className="terminal-buttons" style={{ marginTop: '24px' }}>
        <button className="terminal-button" onClick={onBack} aria-label="Palaa">
          TAKAISIN
        </button>
      </div>
    </div>
  );
}
