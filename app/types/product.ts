export interface Product {
  _id: string;
  name: string;
  product_rating: number;
  description?: string;
  price: number;
  stock: number;
  product_type_id: string;
  image_url: string;
  supplier_name?: string;
  expired_date: string;
  volume?: number;
  created_at: string;
  updated_at: string;
  __v?: number;
  Supplier?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  product_type_id: string;
  image_url: string;
  supplier_name?: string;
  expired_date: string;
  volume: number;
}

export interface ProductUpdateRequest {
  name: string;
  product_rating: number;
  description?: string;
  price: number;
  stock: number;
  product_type_id: string;
  image_url: string;
  supplier_name?: string;
  expired_date: string;
  volume: number;
}

export interface ProductType {
  _id: string;
  name: string;
  description: string;
  __v: number;
}
