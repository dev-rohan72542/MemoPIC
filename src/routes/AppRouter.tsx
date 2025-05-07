import React, { useState } from 'react';
import HomePage from '../pages/HomePage';
import UploadPage from '../pages/UploadPage';
import ProcessingPage from '../pages/ProcessingPage';
import QuizPage from '../pages/QuizPage';
import ResultsPage from '../pages/ResultsPage';
import { generateQuestionsFromImage } from '../services/gemini';

type AppPage = 'home' | 'upload' | 'processing' | 'quiz' | 'results';

const AppRouter: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResults>({
    score: 0,
    totalQuestions: 0,
    answeredCorrectly: [],
    answeredIncorrectly: []
  });
  
  const handleImageUpload = async (file: File) => {
    setError(null);
    setUploadedImage(file);
    setCurrentPage('processing');
    
    try {
      const response = await generateQuestionsFromImage(file);
      
      if (response.success && response.questions) {
        setQuizData(response.questions);
        setCurrentPage('quiz');
      } else {
        throw new Error(response.error || 'Failed to generate quiz');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      setCurrentPage('upload');
    }
  };
  
  const handleQuizComplete = (results: QuizResults) => {
    setQuizResults(results);
    setCurrentPage('results');
  };
  
  const handleStartOver = () => {
    setUploadedImage(null);
    setQuizData([]);
    setError(null);
    setQuizResults({
      score: 0,
      totalQuestions: 0,
      answeredCorrectly: [],
      answeredIncorrectly: []
    });
    setCurrentPage('home');
  };
  
  const handleReviewIncorrect = () => {
    const incorrectQuestions = quizResults.answeredIncorrectly.map(
      index => quizData[index]
    );
    setQuizData(incorrectQuestions);
    setCurrentPage('quiz');
  };

  switch (currentPage) {
    case 'home':
      return <HomePage onGetStarted={() => setCurrentPage('upload')} />;
    case 'upload':
      return <UploadPage onImageUpload={handleImageUpload} error={error} />;
    case 'processing':
      return <ProcessingPage image={uploadedImage} />;
    case 'quiz':
      return <QuizPage questions={quizData} onComplete={handleQuizComplete} />;
    case 'results':
      return (
        <ResultsPage 
          results={quizResults} 
          questions={quizData}
          onStartOver={handleStartOver}
          onReviewIncorrect={handleReviewIncorrect}
        />
      );
    default:
      return <HomePage onGetStarted={() => setCurrentPage('upload')} />;
  }
};

export default AppRouter;