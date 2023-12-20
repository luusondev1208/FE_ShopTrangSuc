import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisService {
  private API_URL = 'http://localhost:5000/api';
  Token = JSON.parse(localStorage.getItem('accessToken') || '{}');
  private httpOptions = {
    headers: new HttpHeaders().set(
      'Authorization', `Bearer ${this.Token}`
    )
  };
  constructor(private http: HttpClient) { }

  getStatistics(startDate?: string, endDate?: string): Observable<any> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
    return this.http.get<any>(`${this.API_URL}/getStat`, { ...this.httpOptions, params });
  }
  getTopBuyer(startDate?: string, endDate?: string): Observable<any> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return this.http.get<any>(`${this.API_URL}/getTopBuyer`, { ...this.httpOptions, params });
  }
}
