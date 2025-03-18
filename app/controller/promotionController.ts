import {
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "../services/promotionService";
import { Promotion } from "../types/promotion";

export const getAllPromotionsController = async (): Promise<Promotion[]> => {
  try {
    const promotions = await getAllPromotions();
    return promotions;
  } catch (error) {
    console.error("Controller error:", error);
    throw error;
  }
};

export const getPromotionByIdController = async (
  id: string
): Promise<Promotion> => {
  try {
    const promotion = await getPromotionById(id);
    return promotion;
  } catch (error) {
    console.error("Controller error:", error);
    throw error;
  }
};

export const createPromotionController = async (
  promotionData: Omit<Promotion, "_id" | "__v">
): Promise<Promotion> => {
  try {
    const promotion = await createPromotion(promotionData);
    return promotion;
  } catch (error) {
    console.error("Controller error:", error);
    throw error;
  }
};

export const updatePromotionController = async (
  id: string,
  promotionData: Partial<Promotion>
): Promise<Promotion> => {
  try {
    const promotion = await updatePromotion(id, promotionData);
    return promotion;
  } catch (error) {
    console.error("Controller error:", error);
    throw error;
  }
};

export const deletePromotionController = async (id: string): Promise<void> => {
  try {
    await deletePromotion(id);
  } catch (error) {
    console.error("Controller error:", error);
    throw error;
  }
};
