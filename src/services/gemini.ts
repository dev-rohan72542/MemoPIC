import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface GeminiResponse {
  success: boolean;
  questions?: QuizQuestion[];
  error?: string;
}

export async function generateQuestionsFromImage(imageFile: File): Promise<GeminiResponse> {
  try {
    // Convert the image file to base64
    const imageBase64 = await fileToBase64(imageFile);

    // Call your Vercel backend
    const response = await fetch('/api/gemini-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageData: imageBase64 }),
    });

    const data = await response.json();

    // Extract and parse the quiz from the Gemini response
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
    }
    if (!text.startsWith('[') || !text.endsWith(']')) {
      throw new Error('Response is not a JSON array');
    }
    const questions = JSON.parse(text) as QuizQuestion[];

    // Validate as before...
    if (!Array.isArray(questions) || questions.length !== 10) {
      throw new Error('Invalid number of questions');
    }
    questions.forEach((q, index) => {
      if (!q.id || !q.question || !Array.isArray(q.options) || !q.correctAnswer) {
        throw new Error(`Question ${index + 1} is missing required fields`);
      }
      if (q.options.length !== 4) {
        throw new Error(`Question ${index + 1} must have exactly 4 options`);
      }
      if (!q.options.includes(q.correctAnswer)) {
        throw new Error(`Question ${index + 1} correct answer must match one of the options`);
      }
    });

    return { success: true, questions };
  } catch (error) {
    console.error('Error generating questions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Failed to generate questions: ${errorMessage}`
    };
  }
}

// Helper function to convert File to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      resolve(base64.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
}
