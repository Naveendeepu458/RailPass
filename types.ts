export interface Train {
  id: string;
  name: string;
  number: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  totalSeats: number;
  bookedSeats: string[];
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  seat: string | null;
}

export interface Booking {
  id: string;
  train: Train;
  passengers: Passenger[];
  totalFare: number;
  bookingDate: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}