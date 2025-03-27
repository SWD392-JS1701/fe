import axiosInstance from "./axiosInstance";

interface GeminiRequest {
  message: string;
}

interface QuestionRequest {
  selections: string[];
}

export const askGemini = async (message: string): Promise<string> => {
  try {
    const response = await axiosInstance.post<string>("/gemini/ask", {
      message,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const askWithSelection = async (
  selections: string[]
): Promise<string> => {
  try {
    const response = await axiosInstance.post<string>("/gemini/question", {
      selections,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 