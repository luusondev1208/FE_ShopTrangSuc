import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SizeService {
  private API_URL = "http://localhost:5000/api/size"
  Token = JSON.parse(localStorage.getItem('accessToken') || '{}');
  private httpOptions = {
    headers: new HttpHeaders().set(
      'Authorization', `Bearer ${this.Token}`
    )
  };
  constructor(private http: HttpClient) { }
  
  createSize(size: any): Observable<any> {
    console.log('Request Payload:', size);
    return this.http.post<any>(`${this.API_URL}/add`, size, this.httpOptions);
  }
  getSizes(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }
  getSize(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }
  deleteSize(id: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`, this.httpOptions);
  }
 
  updateSize(id: string, size: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, size, this.httpOptions);
  }
}
