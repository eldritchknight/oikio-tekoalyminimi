import { useState, useEffect } from 'react';
import type { UiTexts, SurveyData } from './types';
import { loadSurvey } from './data/loadSurvey';
import { loadUiTexts } from './data/loadUiTexts';
import { TerminalShell } from './components/TerminalShell';
import './styles/terminal.css';

function App() {
  const [uiTexts, setUiTexts] = useState<UiTexts | null>(null);
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [texts, survey] = await Promise.all([
          loadUiTexts(),
          loadSurvey(),
        ]);
        setUiTexts(texts);
        setSurveyData(survey);
      } catch (e) {
        console.error('Failed to load data:', e);
        setError('Failed to load application data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="terminal-shell" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="terminal-loading">Loading system</div>
      </div>
    );
  }

  if (error || !uiTexts || !surveyData) {
    return (
      <div className="terminal-shell" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="text-error">{error || 'Unknown error occurred'}</div>
      </div>
    );
  }

  return <TerminalShell uiTexts={uiTexts} surveyData={surveyData} />;
}

export default App;
