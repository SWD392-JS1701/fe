import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/app/types/quiz";

interface QuizFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quiz: Partial<Quiz>) => void;
  initialData?: Quiz;
}

const QuizForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: QuizFormProps) => {
  const [formData, setFormData] = useState({
    quiz_ID: "",
    quiz_Name: "",
    point: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        quiz_ID: initialData.quiz_ID,
        quiz_Name: initialData.quiz_Name,
        point: initialData.point,
      });
    } else {
      setFormData({
        quiz_ID: "",
        quiz_Name: "",
        point: 0,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Quiz" : "Create New Quiz"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="quiz_ID">Quiz ID</label>
              <Input
                id="quiz_ID"
                value={formData.quiz_ID}
                onChange={(e) =>
                  setFormData({ ...formData, quiz_ID: e.target.value })
                }
                placeholder="Enter quiz ID"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="quiz_Name">Quiz Name</label>
              <Input
                id="quiz_Name"
                value={formData.quiz_Name}
                onChange={(e) =>
                  setFormData({ ...formData, quiz_Name: e.target.value })
                }
                placeholder="Enter quiz name"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="point">Points</label>
              <Input
                id="point"
                type="number"
                value={formData.point}
                onChange={(e) =>
                  setFormData({ ...formData, point: Number(e.target.value) })
                }
                placeholder="Enter points"
                required
                min="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Update Quiz" : "Create Quiz"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuizForm;
