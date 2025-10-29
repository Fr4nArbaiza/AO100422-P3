import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra || Constants.manifest?.extra || {}) as any;

export async function getGeminiModel() {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(extra.GEMINI_API_KEY || '');
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
}


