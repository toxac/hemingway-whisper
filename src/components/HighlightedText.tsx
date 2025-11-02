// components/HighlightedText.tsx
import React from 'react';
import { ComplexWord, PassiveVoice, TextHighlight } from '../types';

interface HighlightedTextProps {
  text: string;
  complexWords?: ComplexWord[];
  longSentences?: never[]; // Not used in highlighting but kept for interface consistency
  passiveVoice?: PassiveVoice[];
  onSuggestionClick?: (issue: TextHighlight) => void;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  complexWords = [],
  passiveVoice = [],
  onSuggestionClick
}) => {
  if (!text) return null;

  const highlights: TextHighlight[] = [
    ...complexWords.map(h => ({ ...h, type: 'complex' as const })),
    ...passiveVoice.map(h => ({ ...h, type: 'passive' as const }))
  ];

  // Sort highlights by position
  highlights.sort((a, b) => a.position - b.position);

  const getHighlightColor = (type: TextHighlight['type']): string => {
    switch (type) {
      case 'complex':
        return '#fef3c7';
      case 'passive':
        return '#fecaca';
      default:
        return '#e5e7eb';
    }
  };

  const getHighlightClass = (type: TextHighlight['type']): string => {
    switch (type) {
      case 'complex':
        return 'hemingway-complex';
      case 'passive':
        return 'hemingway-passive';
      default:
        return 'hemingway-default';
    }
  };

  const renderHighlightedText = (): React.ReactNode => {
    if (highlights.length === 0) {
      return <span>{text}</span>;
    }

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    highlights.forEach((highlight, index) => {
      // Add text before highlight
      if (highlight.position > lastIndex) {
        elements.push(
          <span key={`text-${index}`}>
            {text.slice(lastIndex, highlight.position)}
          </span>
        );
      }

      // Add highlighted text
      const highlightEnd = highlight.position + highlight.text.length;
      elements.push(
        <span
          key={`highlight-${index}`}
          className={`hemingway-highlight ${getHighlightClass(highlight.type)}`}
          style={{ backgroundColor: getHighlightColor(highlight.type) }}
          title={`${highlight.type.charAt(0).toUpperCase() + highlight.type.slice(1)} - Click for suggestions`}
          onClick={() => onSuggestionClick && onSuggestionClick(highlight)}
        >
          {text.slice(highlight.position, highlightEnd)}
        </span>
      );

      lastIndex = highlightEnd;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(
        <span key="text-end">{text.slice(lastIndex)}</span>
      );
    }

    return elements;
  };

  return (
    <div className="hemingway-highlighted-text">
      {renderHighlightedText()}
    </div>
  );
};

export default HighlightedText;