import { API_URL } from "@/config";
import axios from "axios";
import {
  Product,
  ProductUpdateRequest,
  ProductType,
  CreateProductRequest,
} from "../types/product";

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      headers: {
        accept: "*/*",
      },
    });
    return (response.data as Product[]).map((product) => ({
      ...product,
      supplier_name: product.supplier_name || product.Supplier,
    }));
  } catch (error: any) {
    console.error("Error fetching products:", error.message || error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
};

export const getProductById = async (
  productId: string
): Promise<Product | null> => {
  try {
    const response = await axios.get(`${API_URL}/products/${productId}`, {
      headers: {
        accept: "*/*",
      },
    });
    const product = response.data as Product;
    return {
      ...product,
      supplier_name: product.supplier_name || product.Supplier,
    };
  } catch (error: any) {
    console.error("Error fetching product details:", error.message || error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch product details"
    );
  }
};

export const createProduct = async (
  product: CreateProductRequest
): Promise<Product> => {
  try {
    const response = await axios.post(`${API_URL}/products`, product, {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const createdProduct = response.data as Product;
    return {
      ...createdProduct,
      supplier_name: createdProduct.supplier_name || createdProduct.Supplier,
    };
  } catch (error: any) {
    console.error("Error creating product:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(
      error.response?.data?.message || "Failed to create product"
    );
  }
};

export const updateProduct = async (
  productId: string,
  product: ProductUpdateRequest
): Promise<Product | null> => {
  try {
    const response = await axios.put(
      `${API_URL}/products/${productId}`,
      product,
      {
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );
    const updatedProduct = response.data as Product;
    return {
      ...updatedProduct,
      supplier_name: updatedProduct.supplier_name || updatedProduct.Supplier,
    };
  } catch (error: any) {
    console.error("Error updating product:", error.message || error);
    throw new Error(
      error.response?.data?.message || "Failed to update product"
    );
  }
};

export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/products/${productId}`, {
      headers: {
        accept: "*/*",
      },
    });
  } catch (error: any) {
    console.error("Error deleting product:", error.message || error);
    throw new Error(
      error.response?.data?.message || "Failed to delete product"
    );
  }
};

export const searchProductsByName = async (
  name: string
): Promise<Product[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/products/searchProduct?name=${encodeURIComponent(name)}`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );
    return (response.data as Product[]).map((product) => ({
      ...product,
      supplier_name: product.supplier_name || product.Supplier,
    }));
  } catch (error: any) {
    console.error("Error searching products by name:", error);
    throw new Error(
      error.response?.data?.message || "Failed to search products by name"
    );
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
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (minPrice !== undefined) params.append("minPrice", minPrice.toString());
    if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());
    if (minRating !== undefined)
      params.append("minRating", minRating.toString());
    if (maxRating !== undefined)
      params.append("maxRating", maxRating.toString());
    if (supplier) params.append("supplier", supplier);

    const response = await axios.get(
      `${API_URL}/searchProduct/search?${params.toString()}`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );
    return (response.data as Product[]).map((product) => ({
      ...product,
      supplier_name: product.supplier_name || product.Supplier,
    }));
  } catch (error: any) {
    console.error("Error searching products:", error);
    throw new Error(
      error.response?.data?.message || "Failed to search products"
    );
  }
};

export const getAllProductTypes = async (): Promise<ProductType[]> => {
  try {
    const response = await axios.get(`${API_URL}/producttypes`, {
      headers: {
        accept: "*/*",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching product types:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch product types"
    );
  }
};

export const getProductTypeById = async (
  productTypeId: string
): Promise<ProductType | null> => {
  try {
    const response = await axios.get(
      `${API_URL}/producttypes/${productTypeId}`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching product type details:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch product type details"
    );
  }
};

export const createProductType = async (
  productType: ProductType
): Promise<ProductType | null> => {
  try {
    const response = await axios.post(`${API_URL}/producttypes`, productType, {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating product type:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create product type"
    );
  }
};

export const updateProductType = async (
  productTypeId: string,
  productType: ProductType
): Promise<ProductType | null> => {
  try {
    const response = await axios.put(
      `${API_URL}/producttypes/${productTypeId}`,
      productType,
      {
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating product type:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update product type"
    );
  }
};

export const deleteProductType = async (
  productTypeId: string
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/producttypes/${productTypeId}`, {
      headers: {
        accept: "*/*",
      },
    });
  } catch (error: any) {
    console.error("Error deleting product type:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete product type"
    );
  }
};
