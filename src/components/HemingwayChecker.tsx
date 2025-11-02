// components/HemingwayChecker.tsx
import React, { useState, useMemo } from 'react';
import { useHemingwayAnalyzer } from '../hooks/useHemingwayAnalyzer';
import { TextHighlight } from '../types';
import HighlightedText from './HighlightedText';
import SuggestionsPanel from './Suggestions';

interface HemingwayCheckerProps {
  content: string;
  onContentChange?: (content: string) => void;
}

const HemingwayChecker: React.FC<HemingwayCheckerProps> = ({ 
  content 
}) => {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedIssue, setSelectedIssue] = useState<TextHighlight | null>(null);
  const { analyzeText } = useHemingwayAnalyzer();

  const analysis = useMemo(() => analyzeText(content), [content, analyzeText]);

  const handleSuggestionClick = (issue: TextHighlight): void => {
    setSelectedIssue(issue);
    setShowSuggestions(true);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleApplySuggestion = (suggestion: any): void => {
    // Implement your suggestion application logic here
    console.log('Applying suggestion:', suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="hemingway-checker">
      {/* Stats Bar */}
      <div className="hemingway-stats bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex flex-wrap gap-4">
          <div className="stat-item">
            <span className="text-sm text-gray-600">Readability Grade:</span>
            <span className={`ml-2 font-semibold ${analysis.readability.grade > 10 ? 'text-red-600' : 'text-green-600'}`}>
              Grade {analysis.readability.grade}
            </span>
          </div>
          <div className="stat-item">
            <span className="text-sm text-gray-600">Complex Words:</span>
            <span className="ml-2 font-semibold">{analysis.complexWords.length}</span>
          </div>
          <div className="stat-item">
            <span className="text-sm text-gray-600">Long Sentences:</span>
            <span className="ml-2 font-semibold">{analysis.longSentences.length}</span>
          </div>
          <div className="stat-item">
            <span className="text-sm text-gray-600">Passive Voice:</span>
            <span className="ml-2 font-semibold">{analysis.passiveVoice.length}</span>
          </div>
          <div className="stat-item">
            <span className="text-sm text-gray-600">Overall Score:</span>
            <span className={`ml-2 font-semibold ${getScoreColor(analysis.overallScore)}`}>
              {analysis.overallScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Highlighted Text Area */}
      <div className="hemingway-content border rounded-lg p-4 bg-white">
        <HighlightedText
          text={content}
          complexWords={analysis.complexWords}
          passiveVoice={analysis.passiveVoice}
          onSuggestionClick={handleSuggestionClick}
        />
      </div>

      {/* Suggestions Panel */}
      {showSuggestions && (
        <SuggestionsPanel
          issue={selectedIssue}
          onClose={() => setShowSuggestions(false)}
          onApplySuggestion={handleApplySuggestion}
        />
      )}

      {/* Long Sentences List */}
      {analysis.longSentences.length > 0 && (
        <div className="long-sentences mt-4">
          <h4 className="font-semibold text-red-600 mb-2">Long Sentences:</h4>
          {analysis.longSentences.map((sentence, index) => (
            <div key={index} className="text-sm text-gray-700 mb-2 p-2 bg-red-50 rounded">
              &quot;{sentence.text}&quot; ({sentence.wordCount} words)
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HemingwayChecker;