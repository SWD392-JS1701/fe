"use client";

import Head from "next/head";
import { useState } from "react";
import QuizQuestion from "@/components/QuizQuestion";
import { questions } from "@/app/data/quizQuestions";

const QuizQuestionsPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [skinType, setSkinType] = useState<string | null>(null);

  const handleAnswer = (questionId: number, selectedAnswers: string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswers,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calculate skin type when quiz is complete
      const totals = {
        Dry: 0,
        Oily: 0,
      };

      // Sum points for each answer
      Object.entries(answers).forEach(([qId, ans]) => {
        const q = questions.find((q) => q.id === parseInt(qId));
        ans.forEach((a) => {
          const answer = q?.answers.find((aObj) => aObj.text === a);
          if (answer) {
            Object.entries(answer.points).forEach(([key, value]) => {
              totals[key as keyof typeof totals] += value;
            });
          }
        });
      });

      // Determine skin type based on highest score
      const skinTypeResult = totals.Dry > totals.Oily ? "Dry" : "Oily";

      setSkinType(skinTypeResult);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-white mt-[70px]">
      <Head>
        <title>Quiz Questions - GlowUp Skincare</title>
        <meta
          name="description"
          content="Answer the quiz questions to discover your Baumann Skin Type."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Quiz Container */}
      <section className="container mx-auto px-6 py-12 mt-30">
        <p className="text-center text-gray-600 mb-8">
          Answer the following 16 questions to discover your Baumann Skin Type.
          Some questions allow multiple answers—select all that apply!
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div
            className="bg-black h-2.5 rounded-full transition-all duration-500"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          ></div>
        </div>

        {/* Display Result if Quiz is Complete */}
        {skinType ? (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-black mb-4">
              Your Baumann Skin Type
            </h2>
            <p className="text-xl text-gray-700 mb-2">
              Your skin type is <span className="font-bold">{skinType}</span>.
            </p>
            <p className="text-gray-600 mb-6">
              {skinType === "Dry"
                ? "Your skin tends to be dry and may need extra moisture and gentle care."
                : "Your skin produces more oil and may need oil-control products."}
            </p>
            <button
              className="bg-black text-white px-6 py-2 rounded-full transition duration-300"
              onClick={() => {
                setCurrentQuestionIndex(0);
                setAnswers({});
                setSkinType(null);
              }}
            >
              Retake Quiz
            </button>
          </div>
        ) : (
          <>
            {/* Current Question */}
            <QuizQuestion
              question={currentQuestion}
              onAnswer={handleAnswer}
              onNext={handleNext}
            />

            {/* Navigation Info */}
            <div className="text-center mt-4 text-gray-600">
              Question {currentQuestionIndex + 1} of 16
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default QuizQuestionsPage;
