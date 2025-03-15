import {
  getFaq,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
} from "@/app/services/faqService";
import { toast } from "react-hot-toast";

export const fetchAllFaqs = async () => {
  try {
    const faqs = await getFaq();
    return faqs;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const fetchFaqById = async (id: string) => {
  try {
    const faq = await getFaqById(id);
    return faq;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const createNewFaq = async (
  staff_id: string,
  question: string,
  answer: string
) => {
  try {
    const newFaq = await createFaq(staff_id, question, answer);
    toast.success("FAQ created successfully!");
    return newFaq;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const updateExistingFaq = async (id: string, faq: any) => {
  try {
    const updatedFaq = await updateFaq(id, faq);
    toast.success("FAQ updated successfully!");
    return updatedFaq;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const deleteExistingFaq = async (id: string) => {
  try {
    const result = await deleteFaq(id);
    toast.success("FAQ deleted successfully!");
    return result;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};
