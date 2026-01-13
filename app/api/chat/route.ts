// This file is intended for Next.js App Router and cannot be used in a static Vite SPA deployment.
// The ChatPanel component currently fetches directly from OpenAI on the client side.

/*
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
        content: `You are a friendly and helpful AI assistant for Akshay Krishnan's portfolio.`
      },
      ...messages
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
*/
export {};
