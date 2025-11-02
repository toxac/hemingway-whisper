// hooks/useHemingwayAnalyzer.ts
import { useCallback, useMemo } from 'react';
import { AnalysisResult } from '../types';
import { analyzeText } from '../utils/hemingwayAnalyzer';

interface UseHemingwayAnalyzerReturn {
  analyzeText: (text: string) => AnalysisResult;
}

export const useHemingwayAnalyzer = (): UseHemingwayAnalyzerReturn => {
  const memoizedAnalyzeText = useCallback((text: string): AnalysisResult => {
    return analyzeText(text);
  }, []);

  return {
    analyzeText: memoizedAnalyzeText
  };
};