export interface Doctor {
  _id?: string;
  user_Id: string;
  certification: string;
  schedule: string;
  description: string;
  __v?: number;
  name: string;
  yearsOfExperience: number;
  availability: string;
  specialties: string[];
  rating: number;
  reviews: number;
  contactNumber: string;
}
