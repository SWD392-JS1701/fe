import { askGemini, askWithSelection } from "@/app/services/geminiService";

export const handleAskGemini = async (message: string) => {
  try {
    const response = await askGemini(message);
    return response;
  } catch (error) {
    throw error;
  }
};

export const handleAskWithSelection = async (selections: string[]) => {
  try {
    const response = await askWithSelection(selections);
    return response;
  } catch (error) {
    throw error;
  }
}; 