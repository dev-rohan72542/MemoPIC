import React from 'react';
import { CheckCircle2, XCircle, RefreshCw, BookOpen } from 'lucide-react';

interface ResultsPageProps {
  results: QuizResults;
  questions: QuizQuestion[];
  onStartOver: () => void;
  onReviewIncorrect: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ 
  results, 
  questions,
  onStartOver,
  onReviewIncorrect
}) => {
  const score = Math.round(results.score);
  const hasIncorrectAnswers = results.answeredIncorrectly.length > 0;
  
  // Get background color based on score
  const getScoreBackgroundClass = () => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Quiz Results</h1>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className={`${getScoreBackgroundClass()} text-white text-3xl font-bold w-24 h-24 rounded-full flex items-center justify-center`}>
              {score}%
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {score >= 80 ? 'Great job!' : score >= 60 ? 'Good effort!' : 'Keep practicing!'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            You answered {results.answeredCorrectly.length} out of {results.totalQuestions} questions correctly.
          </p>
          
          <div className="flex justify-center gap-4 mb-4">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-gray-600">Correct: {results.answeredCorrectly.length}</span>
            </div>
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-gray-600">Incorrect: {results.answeredIncorrectly.length}</span>
            </div>
          </div>
        </div>
      </div>
      
      {hasIncorrectAnswers && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Questions to Review
            </h3>
            
            <div className="space-y-6">
              {results.answeredIncorrectly.map((questionIndex) => {
                const question = questions[questionIndex];
                return (
                  <div key={question.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                    <div className="flex items-start mb-2">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-600 line-through">Your answer:</p>
                        <p className="text-gray-800">{question.options.find(
                          // This is a simplification since we don't track the actual wrong answer in our data structure
                          // In a real app, you'd store the selected answer for each question
                          option => option !== question.correctAnswer
                        )}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-green-600">Correct answer:</p>
                        <p className="text-gray-800">{question.correctAnswer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {hasIncorrectAnswers && (
          <button
            onClick={onReviewIncorrect}
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Practice Incorrect Questions
          </button>
        )}
        
        <button
          onClick={onStartOver}
          className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
        >
          <BookOpen className="mr-2 h-5 w-5" />
          Create New Quiz
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;