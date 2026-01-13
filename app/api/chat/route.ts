import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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',
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `You are a friendly and helpful AI assistant for Akshay Krishnan's portfolio. 
        
        About Akshay:
        - Creative Product Designer specializing in Canvas interactions, React, and Framer Motion.
        - Experience in SaaS (Gravity One), E-Commerce (Velvet), and Data Viz (EcoTrack).
        - Loves creating high-fidelity whiteboard collaboration simulations.
        
        Your Tone:
        - Casual, enthusiastic, and professional.
        - Keep answers concise and engaging.
        - Act like you are chatting on a collaborative whiteboard.`
      },
      ...messages
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}