export interface Combo {
  _id?: string;
  name: string;
  type: string;
  price: number;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateComboRequest {
  name: string;
  type: string;
  price: number;
  description: string;
}

export interface UpdateComboRequest {
  name?: string;
  type?: string;
  price?: number;
  description?: string;
}
