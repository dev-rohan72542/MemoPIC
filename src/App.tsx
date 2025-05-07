import React from 'react';
import { BrainCog } from 'lucide-react';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center gap-2">
            <BrainCog className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-800">MemoPic</h1>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <AppRouter />
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} MemoPic • Rohan Islam • Powered by Gemini AI
        </div>
      </footer>
    </div>
  );
}

export default App;