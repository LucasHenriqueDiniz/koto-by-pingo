export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: string;
  prompt: string;
  japaneseText?: string;
  reading?: string;
  audioUrl?: string;
  imageUrl?: string;
  options: Option[];
  correctOptionId: string;
  explanation?: string;
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface Section {
  id: string;
  title: string;
  type: 'vocabulary' | 'grammar' | 'reading' | 'listening';
  timeLimitMinutes?: number;
  questions: Question[];
}

export interface Exam {
  id: string;
  slug: string;
  title: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  description: string;
  estimatedMinutes: number;
  sections: Section[];
}
