import React from 'react';
import { Upload, BookOpen, BrainCog } from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Transform Images Into Interactive Quizzes
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload your notes, documents, or diagrams and let our AI create personalized quizzes to help you learn faster.
        </p>
        <button
          onClick={onGetStarted}
          className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Get Started
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <FeatureCard 
          icon={<Upload className="h-10 w-10 text-blue-500" />}
          title="Upload Your Material"
          description="Simply upload an image of your notes, textbook pages, or diagrams."
        />
        <FeatureCard 
          icon={<BrainCog className="h-10 w-10 text-blue-500" />}
          title="AI-Powered Analysis"
          description="Our AI understands your content and creates relevant quiz questions."
        />
        <FeatureCard 
          icon={<BookOpen className="h-10 w-10 text-blue-500" />}
          title="Learn Effectively"
          description="Take interactive quizzes that adapt to your performance for better retention."
        />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">1</span>
                <p>Upload an image of your study material</p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">2</span>
                <p>Wait briefly while our AI analyzes the content</p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">3</span>
                <p>Take the generated quiz with multiple-choice questions</p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">4</span>
                <p>Review your results and practice difficult questions</p>
              </li>
            </ol>
          </div>
          <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-8">
            <img 
              src="https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg" 
              alt="Student taking quiz on tablet" 
              className="rounded-lg max-h-64"
            />
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onGetStarted}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Create Your First Quiz
        </button>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition duration-300 ease-in-out hover:shadow-lg">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default HomePage;