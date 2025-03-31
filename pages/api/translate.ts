import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY environment variable is not set');
      return res.status(500).json({
        error: 'Translation service not configured. Please set GEMINI_API_KEY environment variable.',
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const { text, targetLanguage } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!targetLanguage) {
      return res.status(400).json({ error: 'Target language is required' });
    }

    // Only translate to Hindi; English content stays as is
    if (targetLanguage === 'en-IN') {
      return res.status(200).json({ translatedText: text });
    }

    const prompt = `Translate the following text from English to Hindi.
Maintain the original formatting and structure.
Keep technical terms in English but translate everything else.
Do not add any explanations or comments, just return the translated text.
Ensure the translation is natural and fluent in Hindi.

Text to translate: "${text}"`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const responseText = result.response?.text();
    const translatedText = responseText || '';

    return res.status(200).json({ translatedText });

  } catch (error) {
    console.error('Translation error:', error);
    return res.status(500).json({
      error: 'Translation failed',
      translatedText: req.body?.text || '',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}