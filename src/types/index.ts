export {};

declare global {
  interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
  }

  interface QuizResults {
    score: number;
    totalQuestions: number;
    answeredCorrectly: number[];
    answeredIncorrectly: number[];
  }

  interface QuizAnswer {
    questionIndex: number;
    selectedAnswer: string;
    isCorrect: boolean;
  }
}