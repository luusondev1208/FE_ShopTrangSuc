import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  constructor(private http:HttpClient) { }

  getStatistics(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/getStat`, this.httpOptions);
  }

}
