import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { NextResponse } from "next/server";

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  const { language, difficulty, count } = await req.json();

  const prompt = `
Generate ${count} coding challenges for a "Missing Line" game.

Language: ${language}
Difficulty: ${difficulty}

Each challenge must contain:
1. A short task description.
2. A code snippet with ONE missing line.
3. The correct missing line.

The missing line should be represented by an empty line in the code.

Return ONLY valid JSON.

STRICT RULES:
- Output must be a JSON array.
- Do NOT include explanations.
- Do NOT include markdown.
- Do NOT include headings.
- Do NOT use backticks (\`).
- All strings must use double quotes.
- Escape newlines inside code using \\n.
- Do not include any text before or after the JSON.

Required format:

[
  {
    "task": "Short instruction describing what the code should do",
    "code": "function add(a,b){\\n\\n}",
    "answer": "return a + b;"
  }
]
`

  try {
    // Try Gemini first
    const model = gemini.getGenerativeModel({
      model: "models/gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);

    let text = result.response.text();

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(text);

    return NextResponse.json({
      provider: "gemini",
      data: parsed,
    });
  } catch (geminiError) {
    console.log("Gemini failed, switching to Groq");

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
      });

      let text = completion.choices[0].message.content || "";

// remove markdown blocks
text = text.replace(/```json/g, "").replace(/```/g, "").trim();

// extract JSON array
const start = text.indexOf("[");
const end = text.lastIndexOf("]");

if (start === -1 || end === -1) {
  throw new Error("AI returned invalid JSON");
}

let jsonText = text.slice(start, end + 1);

// remove control characters
jsonText = jsonText.replace(/[\u0000-\u001F]+/g, " ");

// remove backticks
jsonText = jsonText.replace(/`/g, "");

// parse JSON
const parsed = JSON.parse(jsonText);

      return NextResponse.json({
        provider: "groq",
        data: parsed,
      });
    } catch (groqError: any) {
      console.error("Groq Error:", groqError);

      return NextResponse.json(
        {
          success: false,
          message: groqError.message || "Groq failed",
        },
        { status: 500 },
      );
    }
  }
}
