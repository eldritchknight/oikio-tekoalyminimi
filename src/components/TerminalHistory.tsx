import { useEffect, useRef } from 'react';
import type { TerminalLine } from '../types';

interface Props {
  lines: TerminalLine[];
}

export function TerminalHistory({ lines }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="terminal-history" ref={containerRef} role="log" aria-live="polite">
      {lines.map((line) => (
        <div
          key={line.id}
          className={`terminal-line terminal-line--${line.type}`}
        >
          {typeof line.content === 'string' ? (
            <span>{line.content}</span>
          ) : (
            line.content
          )}
        </div>
      ))}
    </div>
  );
}
