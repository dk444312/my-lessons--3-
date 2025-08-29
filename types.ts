export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizAttempt {
  score: number;
  total: number;
  timestamp: string;
}

export interface Lesson {
  id: string;
  title: string;
  notes: string;
  imageUrls: string[];
  mcqs: MCQ[];
  createdAt: string;
  course?: string;
  feedback?: string;
  week: number;
  quizAttempts: QuizAttempt[];
}
