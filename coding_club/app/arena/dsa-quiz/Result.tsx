"use client"

import { useRouter } from "next/navigation"

type Question = {
  question: string
  options: string[]
  answer: string
}

type Props = {
  questions: Question[]
  userAnswers: string[]
}

export default function Result({ questions, userAnswers }: Props) {

  const router = useRouter()

  const correct = questions.filter((q, i) => q.answer === userAnswers[i]).length
  const wrong = questions.length - correct
  const accuracy = Math.round((correct / questions.length) * 100)

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">

      <h1 className="text-3xl font-bold">
        Quiz Result
      </h1>

      <div className="space-y-2 text-lg">
        <p>Score: {correct} / {questions.length}</p>
        <p>Correct: {correct}</p>
        <p>Wrong: {wrong}</p>
        <p>Accuracy: {accuracy}%</p>
      </div>

      <div className="flex gap-4">

        <button
          onClick={() => router.push("/arena/dsa-quiz")}
          className="bg-green-500 px-4 py-2 text-black font-semibold"
        >
          Play Again
        </button>

        <button
          onClick={() => router.push("/")}
          className="bg-gray-300 px-4 py-2 text-black font-semibold"
        >
          Back to Home
        </button>

      </div>

      {/* Detailed answers */}

      <div className="space-y-4 pt-4">

        {questions.map((q, i) => {

          const user = userAnswers[i]
          const correctAnswer = q.answer
          const isCorrect = user === correctAnswer

          return (

            <div key={i} className="border p-4 rounded">

              <p className="font-semibold">
                Q{i + 1}. {q.question}
              </p>

              <p className={isCorrect ? "text-green-600" : "text-red-600"}>
                Your Answer: {user}
              </p>

              {!isCorrect && (
                <p className="text-gray-600">
                  Correct Answer: {correctAnswer}
                </p>
              )}

            </div>

          )

        })}

      </div>

    </div>
  )
}