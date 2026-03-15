import { NextResponse } from "next/server"
import OpenAI from "openai"

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1"
})

export async function POST(req: Request) {

  const { topic, difficulty } = await req.json()

  const prompt = `
Generate 5 DSA multiple choice questions.

Topic: ${topic}
Difficulty: ${difficulty}

Return JSON format:

{
 "questions":[
  {
   "question":"...",
   "options":["A","B","C","D"],
   "answer":"correct option"
  }
 ]
}

Return ONLY JSON.
`

  try {

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "Return only valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })

    const text = completion.choices[0].message.content || ""

    const start = text.indexOf("{")
    const end = text.lastIndexOf("}")

    const json = JSON.parse(text.slice(start, end + 1))

    return NextResponse.json(json)

  } catch (error) {

    return NextResponse.json({
      success:false,
      message:"Failed to generate quiz"
    })

  }

}