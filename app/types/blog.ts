export interface Blog {
  _id: string;
  user_id: {
    _id: string;
    first_name: string;
    last_name: string;
  };
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  __v: number;
  author?: string;
}
