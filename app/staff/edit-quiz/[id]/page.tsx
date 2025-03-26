"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Quiz } from "@/app/types/quiz";

const ViewQuizDetail = () => {
  const router = useRouter();
  const { id } = useParams(); // Get the quiz ID from the URL
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data (same as in EditQuizPage) - Replace with API call in a real app
  const mockQuizzes: Quiz[] = [
    {
      _id: "1",
      quiz_ID: "QUIZ001",
      quiz_Name: "Basic Skincare Knowledge",
      point: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    },
    {
      _id: "2",
      quiz_ID: "QUIZ002",
      quiz_Name: "Advanced Skin Types",
      point: 15,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    },
  ];

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // Simulate fetching the quiz by ID
        // In a real app, replace this with an API call, e.g.:
        // const quizData = await getQuizById(id as string);
        const quizData = mockQuizzes.find((q) => q._id === id);

        if (!quizData) {
          throw new Error("Quiz not found");
        }

        setQuiz(quizData);
      } catch (err) {
        setError((err as Error).message || "Failed to load quiz details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const handleBack = () => {
    router.push("/staff/edit-quiz");
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quiz Details</h1>
          <Button onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft size={20} />
            Back to Quiz List
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-red-600">{error || "Quiz not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quiz Details</h1>
        <Button onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft size={20} />
          Back to Quiz List
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{quiz.quiz_Name}</CardTitle>
          <CardDescription>Quiz ID: {quiz.quiz_ID}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Points</p>
              <p className="text-lg">{quiz.point}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Created At</p>
              <p className="text-lg">
                {new Date(quiz.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Updated At</p>
              <p className="text-lg">
                {new Date(quiz.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for Questions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
          <CardDescription>
            This quiz currently has no questions. Add questions to this quiz in
            the edit section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            {/* In the future, this could be a Table component listing questions */}
            No questions available.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewQuizDetail;
