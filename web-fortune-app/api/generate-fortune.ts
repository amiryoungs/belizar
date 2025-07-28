// AIDEV-NOTE: Secure serverless function for OpenAI fortune generation
import { VercelRequest, VercelResponse } from '@vercel/node';

async function generateFortune(): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('OpenAI API key not configured');
    throw new Error('OpenAI API key not configured');
  }

  // AIDEV-NOTE: Crafted prompt for personalized, meaningful fortunes
  const prompt = `Generate a single, thoughtful fortune that feels personal and meaningful. 
  The fortune should be:
  - 80-100 words
  - Inspiring and positive
  - Not generic - feel personal
  - About growth, opportunity, or inner wisdom
  - Written in second person (you/your)
  
  Return only the fortune text, no quotes or extra formatting.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a wise fortune teller who provides meaningful, personal guidance.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.9,
    }),
  });

  if (!response.ok) {
    console.error('OpenAI API error:', response);
    throw new Error(`OpenAI API error: ${response.status}`);
  }
  console.log('OpenAI API response:', response);
  console.log('OpenAI API response:', response.json());
  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || 'Your fortune awaits tomorrow.';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // AIDEV-NOTE: CORS headers for web app access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // AIDEV-NOTE: Basic request validation
    const { userAgent } = req.body || {};
    if (!userAgent || typeof userAgent !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid request format' 
      });
    }

    const fortune = await generateFortune();
    
    return res.status(200).json({
      success: true,
      data: fortune
    });
    
  } catch (error) {
    console.error('Fortune generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate fortune. Please try again.'
    });
  }
}