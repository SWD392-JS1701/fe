export interface Doctor {
  _id?: string;
  user_Id: string;
  certification: string;
  schedule: string;
  description: string;
  __v?: number;
  name: string;
  yearsOfExperience: number;
  consultationFee: number;
  availability: string;
  sessionFee: number;
  specialties: string[];
  rating: number;
  reviews: number;
  location: string;
  contactNumber: string;
}
