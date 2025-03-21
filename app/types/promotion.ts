export interface Promotion {
  _id: string;
  title: string;
  description: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  __v: number;
}

export interface PromotedProduct {
  _id: string;
  promotion_id: string;
  product_id: string;
  __v?: number;
}
