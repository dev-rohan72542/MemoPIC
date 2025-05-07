import React, { useEffect, useState } from 'react';
import { BrainCog } from 'lucide-react';

interface ProcessingPageProps {
  image: File | null;
}

const ProcessingPage: React.FC<ProcessingPageProps> = ({ image }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  
  useEffect(() => {
    const totalSteps = 3;
    const totalTime = 3000; // 3 seconds total for processing
    const stepTime = totalTime / totalSteps;
    
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < totalSteps) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, stepTime);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, totalTime / 100);
    
    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);
  
  const stepTitles = [
    "Analyzing image content",
    "Extracting key information",
    "Generating quiz questions"
  ];
  
  return (
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Processing Your Image</h1>
      
      <div className="relative mb-6">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <BrainCog className="h-12 w-12 text-blue-500" />
        </div>
      </div>
      
      <p className="text-lg font-medium text-gray-800 mb-8">
        {stepTitles[currentStep - 1]}
      </p>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <div 
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
        <p className="mb-2 font-medium">Our AI is working on your image</p>
        <p>We're using advanced AI to analyze your content and create relevant quiz questions. This usually takes just a few seconds.</p>
      </div>
      
      {image && (
        <div className="mt-8 bg-white rounded-lg shadow-sm p-4">
          <div className="text-gray-500 text-sm">Processing image:</div>
          <div className="font-medium text-gray-800 truncate">
            {image.name}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingPage;