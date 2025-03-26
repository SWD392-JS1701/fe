import {
  getAllPromotions,
  getAlPromotedProduct,
  getAllPromotedProductByProductId,
  getPromotionById,
  getPromotedProductById,
  createPromotion,
  createPromotedProduct,
  updatePromotion,
  updatePromotedProduct,
  deletePromotion,
  deletePromotedProduct,
  getPromotedProductByProductId,
} from "../services/promotionService";
import { Promotion, PromotedProduct } from "../types/promotion";

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

export const getAlPromotedProductController = async (): Promise<
  PromotedProduct[]
> => {
  try {
    const promotedProducts = await getAlPromotedProduct();
    return promotedProducts;
  } catch (error) {
    console.error("Controller error:", error);
    throw error;
  }
};

export const getAllPromotedProductByProductIdController = async (
  productId: string
): Promise<Promotion[]> => {
  try {
    const promotedProducts = await getAllPromotedProductByProductId(productId);
    return promotedProducts;
  } catch (error) {
    console.error("Controller error:", error);
    throw error;
  }
};

export const getAllPromotedProductByPromotionIdController = async (
  promotionId: string
): Promise<PromotedProduct[]> => {
  try {
    const promotedProducts = await getAlPromotedProduct();
    const filteredPromotedProducts = promotedProducts.filter(
      (promoted) => promoted.promotion_id === promotionId
    );
    return filteredPromotedProducts;
  } catch (error) {
    console.error("Controller error:", error);
    throw error;
  }
};

export const getPromotedProductByIdController = async (
  id: string
): Promise<PromotedProduct> => {
  try {
    const promotedProduct = await getPromotedProductById(id);
    return promotedProduct;
  } catch (error) {
    console.error("Controller error:", error);
    throw error;
  }
};

export const createPromotedProductController = async (
  promotedProductData: Omit<PromotedProduct, "_id" | "__v">
): Promise<PromotedProduct> => {
  try {
    const promotedProduct = await createPromotedProduct(promotedProductData);
    return promotedProduct;
  } catch (error) {
    console.error("Controller error:", error);
    throw error;
  }
};

export const updatePromotedProductController = async (
  id: string,
  promotedProductData: Partial<PromotedProduct>
): Promise<PromotedProduct> => {
  try {
    const promotedProduct = await updatePromotedProduct(
      id,
      promotedProductData
    );
    return promotedProduct;
  } catch (error) {
    console.error("Controller error:", error);
    throw error;
  }
};

export const deletePromotedProductController = async (
  id: string
): Promise<void> => {
  try {
    await deletePromotedProduct(id);
  } catch (error) {
    console.error("Controller error:", error);
    throw error;
  }
};

export const getPromotedProductByProductIdController = async (
  productId: string
): Promise<Promotion[]> => {
  try {
    const promotions = await getPromotedProductByProductId(productId);
    return promotions;
  } catch (error) {
    console.error("Controller error:", error);
    throw error;
  }
};
