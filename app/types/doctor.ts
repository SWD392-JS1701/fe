export interface Doctor {
  _id?: string;
  user_Id: string;
  name: string;
  certification: string;
  schedule: string;
  description: string;
  specialties: string[];
  consultationFee: number;
  sessionFee: number;
  location: string;
  rating: number;
  reviews: number;
  yearsOfExperience: number;
  contactNumber: string;
  availability: string;
  gender: "Male" | "Female";
  profilePicture?: string;
}
