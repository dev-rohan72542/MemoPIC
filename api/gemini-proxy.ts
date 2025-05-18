import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { imageData } = req.body;
  if (!imageData) {
    res.status(400).json({ error: 'Image data is required' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'API key not configured' });
    return;
  }

  // Sophisticated prompt from frontend
  const prompt = `You are a quiz generator. Analyze this image and create multiple choice questions based on its content and in it's original language.
    
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
    - Each question must have exactly 4 options
    - The correctAnswer must match one of the options exactly
    - The id should be a string number from "1" to "10"
    - Do not include any explanations or additional text
    - Ensure the response is valid JSON
    - Do not translate or transliterate the original language of the image
    
    RESPOND ONLY WITH THE JSON ARRAY, NO OTHER TEXT.`;

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: imageData
            }
          },
          { text: prompt }
        ]
      }]
    })
  });

  const data = await response.json();
  res.status(response.status).json(data);
} 