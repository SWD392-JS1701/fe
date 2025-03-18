"use client";

import React, { FC, useState } from "react";

interface QuizQuestionProps {
  question: {
    id: number;
    text: string;
    type: "single" | "multiple";
    answers: { text: string; points: { [key: string]: number } }[];
  };
  onAnswer: (questionId: number, selectedAnswers: string[]) => void;
  onNext: () => void;
}

const QuizQuestion: FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  onNext,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const handleAnswerChange = (answer: string) => {
    if (question.type === "single") {
      setSelectedAnswers([answer]);
    } else {
      setSelectedAnswers((prev) =>
        prev.includes(answer)
          ? prev.filter((a) => a !== answer)
          : [...prev, answer]
      );
    }
  };

  const handleNext = () => {
    onAnswer(question.id, selectedAnswers);
    setSelectedAnswers([]); // Reset answers for the next question
    onNext();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold text-black mb-4">
        Question {question.id} of 16
      </h2>
      <p className="text-xl font-bold text-black mb-6">{question.text}</p>
      <div className="space-y-4">
        {question.answers.map((answer, index) => (
          <label key={index} className="flex items-center space-x-3">
            {question.type === "single" ? (
              <input
                type="radio"
                name={`question-${question.id}`}
                className="form-radio text-black"
                checked={selectedAnswers.includes(answer.text)}
                onChange={() => handleAnswerChange(answer.text)}
              />
            ) : (
              <input
                type="checkbox"
                className="form-checkbox text-black"
                checked={selectedAnswers.includes(answer.text)}
                onChange={() => handleAnswerChange(answer.text)}
              />
            )}
            <span className="text-gray-700">{answer.text}</span>
          </label>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          className="bg-black text-white px-6 py-2 rounded-full transition duration-300 disabled:opacity-50"
          onClick={handleNext}
          disabled={question.type === "single" && selectedAnswers.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuizQuestion;
