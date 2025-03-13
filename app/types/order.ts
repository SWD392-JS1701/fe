export interface Order {
  _id: string;
  user_Id: string;
  amount: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateOrderRequest {
  user_Id: string;
  amount: number;
}

export interface OrderDetailProduct {
  product_Id: string;
  quantity: number;
  _id?: string;
}

export interface CreateOrderDetailRequest {
  order_Id: string;
  product_List: OrderDetailProduct[];
}

export interface OrderDetail {
  _id: string;
  order_Id: string;
  product_List: OrderDetailProduct[];
  __v?: number;
}
