import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProductsByName,
  searchProducts,
  getAllProductTypes,
  getProductTypeById,
  createProductType,
  updateProductType,
  deleteProductType,
} from "@/app/services/productService";
import { toast } from "react-hot-toast";
import {
  Product,
  ProductUpdateRequest,
  ProductType,
  CreateProductRequest,
} from "../types/product";

export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    const products = await getAllProducts();
    return products;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const fetchProductById = async (
  productId: string
): Promise<Product | null> => {
  try {
    const product = await getProductById(productId);
    return product;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const createNewProduct = async (
  product: CreateProductRequest
): Promise<Product> => {
  try {
    const newProduct = await createProduct(product);
    toast.success("Product created successfully!");
    return newProduct;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const updateExistingProduct = async (
  productId: string,
  product: ProductUpdateRequest
): Promise<Product | null> => {
  try {
    const updatedProduct = await updateProduct(productId, product);
    toast.success("Product updated successfully!");
    return updatedProduct;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const deleteExistingProduct = async (
  productId: string
): Promise<void> => {
  try {
    await deleteProduct(productId);
    toast.success("Product deleted successfully!");
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const searchProductsByNameController = async (
  name: string
): Promise<Product[]> => {
  try {
    const products = await searchProductsByName(name);
    return products;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const searchProductsController = async (
  name?: string,
  minPrice?: number,
  maxPrice?: number,
  minRating?: number,
  maxRating?: number,
  supplier?: string
): Promise<Product[]> => {
  try {
    const products = await searchProducts(
      name,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
      supplier
    );
    return products;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const fetchAllProductTypes = async (): Promise<ProductType[]> => {
  try {
    const productTypes = await getAllProductTypes();
    return productTypes;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const fetchProductTypeById = async (
  productTypeId: string
): Promise<ProductType | null> => {
  try {
    const productType = await getProductTypeById(productTypeId);
    return productType;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const createNewProductType = async (
  productType: ProductType
): Promise<ProductType | null> => {
  try {
    const newProductType = await createProductType(productType);
    toast.success("Product type created successfully!");
    return newProductType;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const updateExistingProductType = async (
  productTypeId: string,
  productType: ProductType
): Promise<ProductType | null> => {
  try {
    const updatedProductType = await updateProductType(
      productTypeId,
      productType
    );
    toast.success("Product type updated successfully!");
    return updatedProductType;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const deleteExistingProductType = async (
  productTypeId: string
): Promise<void> => {
  try {
    await deleteProductType(productTypeId);
    toast.success("Product type deleted successfully!");
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};
