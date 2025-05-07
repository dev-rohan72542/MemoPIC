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
    
    // Initialize the vision model with the updated version
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Enhanced prompt with strict formatting instructions
    const prompt = `You are a quiz generator. Analyze this image and create 10 multiple choice questions based on its content.
    
    IMPORTANT: Your response must be ONLY a valid JSON array with exactly this structure:
    [
      {
        "id": "1",
        "question": "What is shown in the image?",
        "options": [
          "Option A",
          "Option B",
          "Option C",
          "Option D"
        ],
        "correctAnswer": "Option A"
      }
    ]

    Requirements:
    - Generate exactly 10 questions
    - Each question must have exactly 4 options
    - The correctAnswer must match one of the options exactly
    - The id should be a string number from "1" to "10"
    - Do not include any explanations or additional text
    - Ensure the response is valid JSON
    
    RESPOND ONLY WITH THE JSON ARRAY, NO OTHER TEXT.`;

    // Create the image part for the prompt
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: imageFile.type
      }
    };

    // Generate content with retry logic
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount <= maxRetries) {
      try {
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        let text = response.text().trim();
        // Remove Markdown code block if present
        if (text.startsWith('```')) {
          text = text.replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
        }
        // Validate that the response starts and ends with square brackets
        if (!text.startsWith('[') || !text.endsWith(']')) {
          throw new Error('Response is not a JSON array');
        }
        
        // Parse and validate the response
        const questions = JSON.parse(text) as QuizQuestion[];
        
        // Validate the questions array
        if (!Array.isArray(questions) || questions.length !== 10) {
          throw new Error('Invalid number of questions');
        }
        
        // Validate each question
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
        
        return {
          success: true,
          questions
        };
      } catch (parseError) {
        console.error(`Attempt ${retryCount + 1} failed:`, parseError);
        retryCount++;
        
        if (retryCount > maxRetries) {
          return {
            success: false,
            error: 'Failed to generate valid quiz questions after multiple attempts. Please try again.'
          };
        }
        // Wait for a short time before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return {
      success: false,
      error: 'Failed to generate valid quiz questions.'
    };
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
