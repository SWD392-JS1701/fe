import axiosInstance from "./axiosInstance";

export const getFaq = async () => {
  try {
    const response = await axiosInstance.get("/faqs");
    return response.data;
  } catch (error: any) {
    console.error("Get Faq API Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch. Please try again."
    );
  }
};

export const getFaqById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/faqs/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Get Faq By ID API Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch. Please try again."
    );
  }
};

export const createFaq = async (
  staff_id: string,
  question: string,
  answer: string
) => {
  try {
    const response = await axiosInstance.post("/faqs", {
      staff_id,
      question,
      answer,
    });
    return response.data;
  } catch (error: any) {
    console.error("Create Faq API Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create. Please try again."
    );
  }
};

export const updateFaq = async (id: string, faq: any) => {
  try {
    const response = await axiosInstance.put(`/faqs/${id}`, faq);
    return response.data;
  } catch (error: any) {
    console.error("Update Faq API Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update. Please try again."
    );
  }
};

export const deleteFaq = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/faqs/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Delete Faq API Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete. Please try again."
    );
  }
};
