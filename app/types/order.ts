export interface Order {
  _id: string;
  user_Id: string;
  user_fullname: string;
  user_telephone: string;
  user_address: string;
  amount: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateOrderRequest {
  user_Id: string;
  user_fullname: string;
  user_telephone: string;
  user_address: string;
  amount: number;
  status: number;
}

export interface OrderDetail {
  _id: string;
  order_Id: string;
  product_List: {
    name: string;
    product_Id: string;
    quantity: number;
    _id?: string;
  }[];
  __v: number;
}

export interface CreateOrderDetailRequest {
  order_Id: string;
  product_List: {
    name: string;
    product_Id: string;
    quantity: number;
  }[];
}

export interface UpdateOrderDetailRequest {
  product_List?: {
    name: string;
    product_Id: string;
    quantity: number;
  }[];
}

export interface UpdateOrderRequest {
  status?: number;
  user_fullname?: string;
  user_telephone?: string;
  user_address?: string;
  amount?: number;
}
