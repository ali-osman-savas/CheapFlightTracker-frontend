import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FlightSearchRequest, FlightPrice, CheapestDay } from '../models/flight.model';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private readonly API_URL = 'http://localhost:8080/api/flights';

  constructor(private http: HttpClient) {}

  searchFlights(request: FlightSearchRequest): Observable<FlightPrice[]> {
    return this.http.post<FlightPrice[]>(`${this.API_URL}/search`, request);
  }

  getCheapestDays(request: FlightSearchRequest): Observable<CheapestDay[]> {
    return this.http.post<CheapestDay[]>(`${this.API_URL}/cheapest-days`, request);
  }

  getAllFlightPrices(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get(`http://localhost:8080/api/flight-prices/page`, { params });
  }
}