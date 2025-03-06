export interface ProductSample {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  order: number;
  stock: number;
  price: number;
  discount: number;
  sales: string;
  salesDuration: string;
  status: "Active" | "Inactive";
  image: string;
  orders: number;
}
