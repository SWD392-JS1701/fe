import { API_URL } from "@/config";

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
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
