import React, { useState, useRef, useEffect } from 'react';

interface Props {
  onCommand: (command: string) => void;
  placeholder?: string;
}

export function CommandInput({ onCommand, placeholder = 'Kirjoita komento...' }: Props) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onCommand(value);
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Focus stays on input after command
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form className="terminal-input-container" onSubmit={handleSubmit}>
      <span className="terminal-prompt" aria-hidden="true">&gt;</span>
      <input
        ref={inputRef}
        type="text"
        className="terminal-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Komentojen syöttö"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </form>
  );
}
