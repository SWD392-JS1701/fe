import {
  getAllCombos,
  getComboById,
  createCombo,
  updateCombo,
  deleteCombo,
} from "@/app/services/comboService";
import { toast } from "react-hot-toast";
import { CreateComboRequest, UpdateComboRequest } from "@/app/types/combo";

export const getAllCombosController = async () => {
  try {
    const combos = await getAllCombos();
    return combos;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const getComboByIdController = async (id: string) => {
  try {
    const combo = await getComboById(id);
    return combo;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const createComboController = async (
  name: string,
  type: string,
  price: number,
  description: string
) => {
  try {
    const comboData: CreateComboRequest = { name, type, price, description };
    const newCombo = await createCombo(comboData);
    toast.success("Combo created successfully!");
    return newCombo;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const updateComboController = async (
  id: string,
  combo: UpdateComboRequest
) => {
  try {
    const updatedCombo = await updateCombo(id, combo);
    toast.success("Combo updated successfully!");
    return updatedCombo;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const deleteComboController = async (id: string) => {
  try {
    await deleteCombo(id);
    toast.success("Combo deleted successfully!");
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};
