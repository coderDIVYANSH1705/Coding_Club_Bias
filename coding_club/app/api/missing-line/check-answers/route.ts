import { GoogleGenerativeAI } from "@google/generative-ai"
import OpenAI from "openai"
import { NextResponse } from "next/server"

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
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
- Escape line breaks using \\n
`

  /* ───────── SAFE JSON PARSER ───────── */
  function parseAIJSON(text: string) {

    // remove markdown
    text = text.replace(/```json/g, "").replace(/```/g, "").trim()

    const start = text.indexOf("[")
    const end = text.lastIndexOf("]")

    if (start === -1 || end === -1) {
      throw new Error("AI returned invalid JSON")
    }

    let jsonText = text.slice(start, end + 1)

    // remove control characters
    jsonText = jsonText.replace(/[\u0000-\u001F]+/g, " ")

    // fix invalid escapes
    jsonText = jsonText.replace(/\\(?!["\\/bfnrtu])/g, "\\\\")

    try {
      return JSON.parse(jsonText)
    } catch (err) {
      console.error("Broken AI JSON:", jsonText)
      throw err
    }
  }

  try {

    /* ───────── TRY GEMINI FIRST ───────── */

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

      /* ───────── GROQ FALLBACK ───────── */

      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a strict JSON API. Return ONLY JSON."
          },
          {
            role: "user",
            content: prompt
          }
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