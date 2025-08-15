export interface FlightSearchRequest {
  origin: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  maxPrice?: number;
  limit?: number;
}

export interface FlightPrice {
  id: number;
  price: number;
  departureDate: string;
  returnDate?: string;
  route: FlightRoute;
  provider: FlightProvider;
}

export interface FlightRoute {
  id: number;
  origin: string;
  destination: string;
  distance?: number;
}

export interface FlightProvider {
  id: number;
  name: string;
  website?: string;
  active: boolean;
}

export interface CheapestDay {
  day: string;
  minPrice: number;
}