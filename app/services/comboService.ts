import axiosInstance from "./axiosInstance";
import { Combo, CreateComboRequest, UpdateComboRequest } from "../types/combo";

export const getAllCombos = async (): Promise<Combo[]> => {
  try {
    const response = await axiosInstance.get("/combos");
    return response.data as Combo[];
  } catch (error: any) {
    console.error("Combo API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch combos. Please try again."
    );
  }
};

export const getComboById = async (id: string): Promise<Combo> => {
  try {
    const response = await axiosInstance.get(`/combos/${id}`);
    return response.data as Combo;
  } catch (error: any) {
    console.error("Combo API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch combo. Please try again."
    );
  }
};

export const createCombo = async (
  comboData: CreateComboRequest
): Promise<Combo> => {
  try {
    const response = await axiosInstance.post("/combos", comboData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data as Combo;
  } catch (error: any) {
    console.error("Combo API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to create combo. Please try again."
    );
  }
};

export const updateCombo = async (
  id: string,
  combo: UpdateComboRequest
): Promise<Combo> => {
  try {
    const response = await axiosInstance.put(`/combos/${id}`, combo, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data as Combo;
  } catch (error: any) {
    console.error("Combo API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to update combo. Please try again."
    );
  }
};

export const deleteCombo = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/combos/${id}`);
  } catch (error: any) {
    console.error("Combo API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to delete combo. Please try again."
    );
  }
};
