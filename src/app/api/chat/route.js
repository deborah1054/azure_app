// src/app/api/chat/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // Replace with your OpenRouter key
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",  // change model if you like
        messages,
      }),
    });

    const data = await response.json();

    // Return the model’s response in a compatible format for useChat
    return NextResponse.json({
      message: data.choices?.[0]?.message ?? { role: 'assistant', content: 'No response.' },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
