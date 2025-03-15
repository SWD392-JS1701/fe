export interface Appointment {
  id: string;
  date: string;
  time: string;
  location: string;
  title: string;
  attendees: { name: string; image: string }[];
}
