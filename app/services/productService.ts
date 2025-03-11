import { API_URL } from "@/config";
import axios from "axios";

import { Product } from "../types/product";

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductById = async (
  productId: string
): Promise<Product | null> => {
  try {
    const response = await axios.get(`${API_URL}/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
};

export const createProduct = async (
  product: Product
): Promise<Product | null> => {
  try {
    const response = await axios.post(`${API_URL}/products`, product);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    return null;
  }
};

export const updateProduct = async (
  productId: string,
  product: Product
): Promise<Product | null> => {
  try {
    const response = await axios.patch(
      `${API_URL}/products/${productId}`,
      product
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
  }
};

export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/products/${productId}`);
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};
export const searchProductsByName = async (name: string): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_URL}/products/searchProduct?name=${encodeURIComponent(name)}`);
    return response.data;
  } catch (error) {
    console.error("Error searching products by name:", error);
    return [];
  }
};

export const searchProducts = async (
  name?: string,
  minPrice?: number,
  maxPrice?: number,
  minRating?: number,
  maxRating?: number,
  supplier?: string
): Promise<Product[]> => {
  try {
    // Construct query parameters dynamically
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (minPrice !== undefined) params.append("minPrice", minPrice.toString());
    if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());
    if (minRating !== undefined) params.append("minRating", minRating.toString());
    if (maxRating !== undefined) params.append("maxRating", maxRating.toString());
    if (supplier) params.append("supplier", supplier);

    const response = await axios.get(`${API_URL}/searchProduct/search?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};


