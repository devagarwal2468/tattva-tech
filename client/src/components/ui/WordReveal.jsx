import React from 'react';

/** Splits text into words that fade/blur in one after another. Screen readers get plain text. */
export default function WordReveal({ text, className = '', wordClassName = '', startIndex = 0 }) {
  const words = text.split(' ');
  return (
    <span className={`word-reveal ${className}`}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className={wordClassName} style={{ '--i': i + startIndex }}>
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}
