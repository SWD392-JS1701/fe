import { API_URL } from "@/config";
import axios from "axios";
import { Promotion, PromotedProduct } from "../types/promotion";

export const getAllPromotions = async (): Promise<Promotion[]> => {
  try {
    const response = await axios.get(`${API_URL}/promotions`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching promotions:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch promotions"
    );
  }
};

export const getPromotionById = async (id: string): Promise<Promotion> => {
  try {
    const response = await axios.get(`${API_URL}/promotions/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching promotion:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch promotion"
    );
  }
};

export const createPromotion = async (
  promotionData: Omit<Promotion, "_id" | "__v">
): Promise<Promotion> => {
  try {
    const response = await axios.post(`${API_URL}/promotions`, promotionData);
    return response.data;
  } catch (error: any) {
    console.error("Error creating promotion:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create promotion"
    );
  }
};

export const updatePromotion = async (
  id: string,
  promotionData: Partial<Promotion>
): Promise<Promotion> => {
  try {
    const response = await axios.patch(
      `${API_URL}/promotions/${id}`,
      promotionData
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating promotion:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update promotion"
    );
  }
};

export const deletePromotion = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/promotions/${id}`);
  } catch (error: any) {
    console.error("Error deleting promotion:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete promotion"
    );
  }
};

export const getAlPromotedProduct = async (): Promise<PromotedProduct[]> => {
  try {
    const response = await axios.get(`${API_URL}/promoted-products`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching promoted products:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch promoted products"
    );
  }
};

export const getAllPromotedProductByProductId = async (
  productId: string
): Promise<Promotion[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/promoted-products?productId=${productId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching promoted products:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch promoted products"
    );
  }
};

export const getPromotedProductById = async (
  id: string
): Promise<PromotedProduct> => {
  try {
    const response = await axios.get(`${API_URL}/promoted-products/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching promoted product:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch promoted product"
    );
  }
};

export const createPromotedProduct = async (
  promotedProductData: Omit<PromotedProduct, "_id" | "__v">
): Promise<PromotedProduct> => {
  try {
    const response = await axios.post(
      `${API_URL}/promoted-products`,
      promotedProductData
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating promoted product:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create promoted product"
    );
  }
};

export const updatePromotedProduct = async (
  id: string,
  promotedProductData: Partial<PromotedProduct>
): Promise<PromotedProduct> => {
  try {
    const response = await axios.put(
      `${API_URL}/promoted-products/${id}`,
      promotedProductData
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating promoted product:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update promoted product"
    );
  }
};

export const deletePromotedProduct = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/promoted-products/${id}`);
  } catch (error: any) {
    console.error("Error deleting promoted product:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete promoted product"
    );
  }
};
