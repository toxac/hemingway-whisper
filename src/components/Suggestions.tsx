// components/SuggestionsPanel.tsx
import React from 'react';
import { TextHighlight, Suggestion } from '../types';

interface SuggestionsPanelProps {
  issue: TextHighlight | null;
  onClose: () => void;
  onApplySuggestion: (suggestion: Suggestion) => void;
}

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({
  issue,
  onClose,
  onApplySuggestion
}) => {
  if (!issue) return null;

  const getSuggestions = (highlight: TextHighlight): Suggestion[] => {
    switch (highlight.type) {
      case 'complex':
        return [{
          type: 'complex',
          original: highlight.text,
          suggestion: `Use a simpler word than "${highlight.text}"`,
          reason: 'Complex words can make your writing harder to read'
        }];
      case 'passive':
        return [{
          type: 'passive',
          original: highlight.text,
          suggestion: `Rewrite in active voice: "${highlight.text}"`,
          reason: 'Active voice is more direct and engaging'
        }];
      default:
        return [];
    }
  };

  const suggestions = getSuggestions(issue);

  return (
    <div className="suggestions-panel fixed right-4 top-4 w-80 bg-white border rounded-lg shadow-lg p-4 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">Writing Suggestions</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-700 mb-2">{suggestion.reason}</p>
            <p className="text-sm font-medium mb-2">{suggestion.suggestion}</p>
            <button
              onClick={() => onApplySuggestion(suggestion)}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Apply Suggestion
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsPanel;