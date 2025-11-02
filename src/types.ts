export interface ReadabilityScore {
    grade: number;
    score: number;
}

export interface TextHighlight {
    text: string;
    position: number;
    type: 'complex' | 'passive' | 'adverb' | 'long-sentence';
    suggestion?: string;
}



export interface ComplexWord extends TextHighlight {
    word: string;
    syllableCount: number;
    index: number;
    type: 'complex';
}

export interface LongSentence extends TextHighlight {
    sentence: string;
    wordCount: number;
    type: 'long-sentence';
}

export interface PassiveVoice extends TextHighlight {
    type: 'passive';
}

export interface AnalysisResult {
    readability: ReadabilityScore;
    complexWords: ComplexWord[];
    longSentences: LongSentence[];
    passiveVoice: PassiveVoice[];
    overallScore: number;
}

export interface Suggestion {
    type: string;
    original: string;
    suggestion: string;
    reason: string;
}