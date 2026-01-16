import type { UiTexts } from '../types';

interface Props {
  uiTexts: UiTexts;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ResetView({ uiTexts, onConfirm, onCancel }: Props) {
  const { reset } = uiTexts;

  return (
    <div className="reset-view" role="alertdialog" aria-labelledby="reset-title" aria-describedby="reset-desc">
      <h2 id="reset-title" className="terminal-section-header text-error">{reset.title}</h2>

      <div id="reset-desc" style={{ marginBottom: '24px' }}>
        {reset.description.map((line, i) => (
          <p key={i} className="text-dim">{line}</p>
        ))}
      </div>

      <div className="terminal-buttons">
        <button
          className="terminal-button terminal-button--danger"
          onClick={onConfirm}
          aria-label="Vahvista nollaus"
        >
          {reset.buttons.confirm}
        </button>
        <button
          className="terminal-button"
          onClick={onCancel}
          aria-label="Peruuta"
          autoFocus
        >
          {reset.buttons.cancel}
        </button>
      </div>
    </div>
  );
}
