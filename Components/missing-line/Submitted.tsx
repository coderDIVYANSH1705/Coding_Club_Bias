"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Question = {
  task: string;
  code: string;
  answer: string;
};

type Props = {
  questions: Question[];
  userCodes: string[];
};

export default function Submitted({ questions, userCodes }: Props) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAnswers() {
      const res = await fetch("/api/missing-line/check-answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions,
          userCodes,
        }),
      });

      const data = await res.json();

      setResult(data);
      setLoading(false);
    }

    checkAnswers();
  }, []);

  if (loading) {
    return <p className="text-lg">Checking answers...</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Results</h2>

      {result?.data?.map((r: any, i: number) => (
        <div key={i} className="border p-4 rounded">
          <p className="font-semibold">Question {i + 1}</p>

          <p>{r.correct ? "✅ Correct" : "❌ Wrong"}</p>

          {!r.correct && (
            <p className="text-sm text-gray-500">Correct Answer: {r.answer}</p>
          )}
        </div>
      ))}
      <button
        onClick={() => router.push("/")}
        className="bg-green-500 text-black px-4 py-2 font-semibold rounded"
      >
        Back to Home
      </button>
    </div>
  );
}
