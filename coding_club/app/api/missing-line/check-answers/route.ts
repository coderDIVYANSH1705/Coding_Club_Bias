import { GoogleGenerativeAI } from "@google/generative-ai"
import OpenAI from "openai"
import { NextResponse } from "next/server"

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
})

export async function POST(req: Request) {

  const { questions, userCodes } = await req.json()

  const prompt = `
Check if the user completed the missing line correctly.

Return ONLY valid JSON.

Format:
[
  { "correct": true, "answer": "correct line" }
]

Questions:
${JSON.stringify(questions)}

User Answers:
${JSON.stringify(userCodes)}

Rules:
- Return ONLY JSON
- No markdown
- No explanations
- No headings
`

  // helper to safely parse AI JSON
  function parseAIJSON(text: string) {

    text = text.replace(/```json/g, "").replace(/```/g, "").trim()

    const start = text.indexOf("[")
    const end = text.lastIndexOf("]")

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON from AI")
    }

    const jsonText = text.slice(start, end + 1)

    return JSON.parse(jsonText)
  }

  try {

    // GEMINI FIRST
    const model = gemini.getGenerativeModel({
      model: "models/gemini-2.5-flash"
    })

    const result = await model.generateContent(prompt)

    const text = result.response.text()

    const parsed = parseAIJSON(text)

    return NextResponse.json({
      provider: "gemini",
      data: parsed
    })

  } catch (geminiError) {

    console.log("Gemini failed → switching to Groq")

    try {

      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "user", content: prompt }
        ]
      })

      const text = completion.choices[0].message.content || ""

      const parsed = parseAIJSON(text)

      return NextResponse.json({
        provider: "groq",
        data: parsed
      })

    } catch (groqError: any) {

      console.error("Groq Error:", groqError)

      return NextResponse.json(
        {
          success: false,
          message: "AI services unavailable right now."
        },
        { status: 500 }
      )

    }

  }

}