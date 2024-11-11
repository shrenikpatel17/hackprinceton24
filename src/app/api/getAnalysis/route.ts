
import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const data = await req.json();

    if (!data) {
      return NextResponse.json(
        { error: 'Invalid or missing prompt' },
        { status: 400 }
      );
    }

    const systemPrompt = "Here is comprehensize time data about sectors and their percent change over time. Please analyze the portfolio breakdown in terms of sectors, and understand overall trends. Explain these trends in a lot of detail so they are helpful and informative to the user.";

    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-2024-08-06',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `${data}---------------------What key patterns are prevalant in the data? Why? What events triggered them? Provide a detailed and informative description. PLEASE ANSWER IN BULLET POINTS!! DO NOT WRITE IN MARKDOWN!! KEEP IT SHORT: UNDER 250 WORDS` }
      ],
      temperature: 0.5,
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json(
      { error: 'Failed to generate overall information' },
      { status: 500 }
    );
  }
}
