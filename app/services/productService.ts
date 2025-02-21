import { API_URL } from "@/config";
import axios from "axios";

export interface Product {
  _id: string;
  name: string;
  product_rating: number;
  description: string;
  price: number;
  stock: number;
  product_type_id: number;
  image_url: string;
  Supplier: string;
  expired_date: string;
  volume: number;
  created_at: string;
  updated_at: string;
}

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
