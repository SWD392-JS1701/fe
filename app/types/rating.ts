export interface Rating {
  _id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export type CreateRatingInput = Omit<Rating, "_id" | "createdAt">;
