import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface QuizPageProps {
  questions: QuizQuestion[];
  onComplete: (results: QuizResults) => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(30); // seconds per question
  
  const currentQuestion = questions[currentQuestionIndex];
  
  React.useEffect(() => {
    // Reset state when moving to a new question
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setTimeRemaining(30);
    
    // Start timer for current question
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isAnswerSubmitted) {
            handleTimeOut();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuestionIndex]);
  
  const handleSelectAnswer = (answer: string) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answer);
      processAnswer(answer);
    }
  };
  
  const handleTimeOut = () => {
    if (!isAnswerSubmitted) {
      // Auto-select first option if time runs out
      const defaultAnswer = currentQuestion.options[0];
      processAnswer(defaultAnswer);
    }
  };
  
  const processAnswer = (answer: string) => {
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    // Record the answer
    setAnswers([
      ...answers,
      {
        questionIndex: currentQuestionIndex,
        selectedAnswer: answer,
        isCorrect
      }
    ]);
    
    setIsAnswerSubmitted(true);
    
    // Wait a moment to show feedback before moving to next question
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Quiz is complete
        completeQuiz();
      }
    }, 1500);
  };
  
  const completeQuiz = () => {
    const correctAnswers = answers.filter(a => a.isCorrect);
    const incorrectAnswers = answers.filter(a => !a.isCorrect);
    
    const results: QuizResults = {
      score: (correctAnswers.length / questions.length) * 100,
      totalQuestions: questions.length,
      answeredCorrectly: correctAnswers.map(a => a.questionIndex),
      answeredIncorrectly: incorrectAnswers.map(a => a.questionIndex)
    };
    
    onComplete(results);
  };
  
  const getProgressPercent = () => {
    return ((currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)) / questions.length) * 100;
  };
  
  const getOptionClassName = (option: string) => {
    if (!isAnswerSubmitted) {
      return `border ${
        selectedAnswer === option
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      } rounded-lg p-4 cursor-pointer transition-all duration-150 ease-in-out`;
    }
    
    if (option === currentQuestion.correctAnswer) {
      return 'border border-green-500 bg-green-50 rounded-lg p-4';
    }
    
    if (selectedAnswer === option && option !== currentQuestion.correctAnswer) {
      return 'border border-red-500 bg-red-50 rounded-lg p-4';
    }
    
    return 'border border-gray-200 rounded-lg p-4 opacity-50';
  };
  
  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="flex items-center text-sm font-medium text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            {timeRemaining} sec
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${getProgressPercent()}%` }}
          ></div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={getOptionClassName(option)}
                onClick={() => handleSelectAnswer(option)}
              >
                <div className="flex items-center">
                  <div className="mr-3 flex-shrink-0">
                    {isAnswerSubmitted && option === currentQuestion.correctAnswer && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {isAnswerSubmitted && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    {(!isAnswerSubmitted || (isAnswerSubmitted && option !== currentQuestion.correctAnswer && selectedAnswer !== option)) && (
                      <div className={`h-5 w-5 rounded-full border ${
                        selectedAnswer === option 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      } flex items-center justify-center`}>
                        {selectedAnswer === option && !isAnswerSubmitted && (
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    )}
                  </div>
                  <span className={isAnswerSubmitted && selectedAnswer === option && option !== currentQuestion.correctAnswer ? 'line-through' : ''}>
                    {option}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Submit button removed - answers are submitted immediately on selection */}
    </div>
  );
};

export default QuizPage;
