import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisService {
  private API_URL = 'http://localhost:5000/api/statis';
  Token = JSON.parse(localStorage.getItem('accessToken') || '{}');
  private httpOptions = {
    headers: new HttpHeaders().set(
      'Authorization', `Bearer ${this.Token}`
    )
  };
  constructor(private http: HttpClient) { }

  getStatistics(startDate?: string, endDate?: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/getStat`, { ...this.httpOptions });
  }
  getTopBuyer(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/getTopBuyer`, { ...this.httpOptions });
  }
  getTopProductSeller(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/getTopProductSeller`, { ...this.httpOptions });
  }

  getTotalPriceMonth(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/getTotalPriceMonth`, data);
  }

  getTotalPriceDay(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/getTotalPriceDay`, data);
  }
}
