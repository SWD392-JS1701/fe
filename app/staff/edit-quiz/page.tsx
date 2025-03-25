"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";

import { Quiz } from "@/app/types/quiz";
import QuizForm from "@/components/QuizForm";

const EditQuizPage = () => {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([
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
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewDetail = (quizId: string) => {
    router.push(`/staff/edit-quiz/${quizId}`);
  };

  const handleAdd = () => {
    setSelectedQuiz(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (quizData: Partial<Quiz>) => {
    if (selectedQuiz) {
      setQuizzes(
        quizzes.map((quiz) =>
          quiz._id === selectedQuiz._id
            ? { ...quiz, ...quizData, updatedAt: new Date().toISOString() }
            : quiz
        )
      );
    } else {
      const newQuiz: Quiz = {
        _id: (quizzes.length + 1).toString(),
        ...quizData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      } as Quiz;
      setQuizzes([...quizzes, newQuiz]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setQuizzes(quizzes.filter((quiz) => quiz._id !== id));
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.quiz_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quiz Management</h1>
        <Button className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={20} />
          Add New Quiz
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quiz ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuizzes.map((quiz) => (
              <TableRow key={quiz._id}>
                <TableCell>{quiz.quiz_ID}</TableCell>
                <TableCell>{quiz.quiz_Name}</TableCell>
                <TableCell>{quiz.point}</TableCell>
                <TableCell>
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(quiz.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      className="text-gray-600 hover:text-gray-800"
                      aria-label="View product details"
                      onClick={() => handleViewDetail(quiz._id)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      aria-label="Edit product"
                      onClick={() => handleEdit(quiz)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      aria-label="Delete product"
                      onClick={() => handleDelete(quiz._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <QuizForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedQuiz}
      />
    </div>
  );
};

export default EditQuizPage;
