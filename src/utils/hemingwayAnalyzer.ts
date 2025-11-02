// utils/hemingwayAnalyzer.ts
import { 
  ReadabilityScore, 
  ComplexWord, 
  LongSentence, 
  PassiveVoice, 
  AnalysisResult 
} from '../types';

export const analyzeReadability = (text: string): ReadabilityScore => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  
  if (sentences.length === 0 || words.length === 0) {
    return { grade: 0, score: 0 };
  }
  
  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = words.reduce((sum, word) => 
    sum + countSyllables(word), 0) / words.length;
  
  // Flesch Reading Ease score
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  const grade = Math.round(
    0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59
  );
  
  return { grade: Math.max(0, grade), score };
};

export const findComplexWords = (text: string, complexityThreshold: number = 3): ComplexWord[] => {
  const words = text.split(/\s+/);
  const complexWords: ComplexWord[] = [];
  
  words.forEach((word, index) => {
    const cleanWord = word.replace(/[^\w]/g, '');
    const syllableCount = countSyllables(cleanWord);
    
    if (syllableCount >= complexityThreshold && cleanWord.length > 0) {
      complexWords.push({
        word: cleanWord,
        index,
        syllableCount,
        position: text.indexOf(word),
        type: 'complex',
        text: word,
        suggestion: `Consider using a simpler word instead of "${cleanWord}"`
      });
    }
  });
  
  return complexWords;
};

export const findLongSentences = (text: string, wordThreshold: number = 20): LongSentence[] => {
  const sentences = text.split(/[.!?]+/);
  const longSentences: LongSentence[] = [];
  
  let currentPosition = 0;
  sentences.forEach(sentence => {
    const trimmedSentence = sentence.trim();
    if (trimmedSentence.length === 0) return;
    
    const words = trimmedSentence.split(/\s+/);
    if (words.length > wordThreshold) {
      longSentences.push({
        sentence: trimmedSentence,
        wordCount: words.length,
        position: currentPosition,
        type: 'long-sentence',
        text: trimmedSentence.substring(0, 100) + (trimmedSentence.length > 100 ? '...' : ''),
        suggestion: `Break this ${words.length}-word sentence into shorter sentences`
      });
    }
    currentPosition += sentence.length + 1;
  });
  
  return longSentences;
};

export const findPassiveVoice = (text: string): PassiveVoice[] => {
  const passivePatterns = [
    /\b(am|is|are|was|were|be|being|been)\s+[\w\s]+\b(ed|en|t)\b/gi,
    /\b(get|got|gets)\s+[\w\s]+\b(ed|en|t)\b/gi
  ];
  
  const passiveInstances: PassiveVoice[] = [];
  
  passivePatterns.forEach(pattern => {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      passiveInstances.push({
        text: match[0],
        position: match.index,
        type: 'passive',
        suggestion: "Consider using active voice instead of passive"
      });
    }
  });
  
  return passiveInstances;
};

// Helper function to count syllables
const countSyllables = (word: string): number => {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
};

export const analyzeText = (text: string): AnalysisResult => {
  if (!text || text.trim().length === 0) {
    return {
      readability: { grade: 0, score: 0 },
      complexWords: [],
      longSentences: [],
      passiveVoice: [],
      overallScore: 100
    };
  }

  const readability = analyzeReadability(text);
  const complexWords = findComplexWords(text);
  const longSentences = findLongSentences(text);
  const passiveVoice = findPassiveVoice(text);
  
  const overallScore = calculateOverallScore(
    readability,
    complexWords,
    longSentences,
    passiveVoice
  );

  return {
    readability,
    complexWords,
    longSentences,
    passiveVoice,
    overallScore
  };
};

const calculateOverallScore = (
  readability: ReadabilityScore,
  complexWords: ComplexWord[],
  longSentences: LongSentence[],
  passiveVoice: PassiveVoice[]
): number => {
  let score = 100;
  
  // Penalize for low readability
  if (readability.grade > 12) score -= 20;
  else if (readability.grade > 10) score -= 10;
  
  // Penalize for complex words
  score -= Math.min(complexWords.length * 2, 20);
  
  // Penalize for long sentences
  score -= Math.min(longSentences.length * 3, 15);
  
  // Penalize for passive voice
  score -= Math.min(passiveVoice.length * 2, 10);
  
  return Math.max(0, score);
};