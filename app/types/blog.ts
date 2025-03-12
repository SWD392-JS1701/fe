export interface Blog {
  _id: string;
  doctor_id: {
    _id: string;
    first_name: string;
    last_name: string;
  };
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  __v: number;
  author: string;
  id: string;
}
