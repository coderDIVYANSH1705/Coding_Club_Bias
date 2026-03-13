"use client"

import { useState } from "react"

type Props = {
  onStart: (data: {
    language: string
    difficulty: string
    count: number
  }) => void
}

export default function Select({ onStart }: Props) {

  const [language, setLanguage] = useState("javascript")
  const [difficulty, setDifficulty] = useState("basic")
  const [count, setCount] = useState(5)

  return (
    <div className="flex flex-col gap-6 max-w-md">

      <h2 className="text-2xl font-bold">Start Missing Line Challenge</h2>

      {/* Language */}
      <div>
        <label className="block mb-2">Select Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block mb-2">Select Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="basic">Basic</option>
          <option value="intermediate">Intermediate</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Question Count */}
      <div>
        <label className="block mb-2">Number of Questions</label>
        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="border p-2 w-full"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>

      <button
        onClick={() => onStart({ language, difficulty, count })}
        className="bg-green-500 text-black font-semibold py-2"
      >
        Start Challenge
      </button>

    </div>
  )
}