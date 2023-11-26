import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:5000/order';
  Token = JSON.parse(localStorage.getItem('accessToken') || '{}');
  private httpOptions = {
    headers: new HttpHeaders().set(
      'Authorization', `Bearer ${this.Token}`
    )
  };

  constructor(private http: HttpClient) { }

  createOrder(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data, this.httpOptions);
  }

  getUserOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getAllOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin`);
  }

  createPaymentUrl(data: { amount: number, language: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create_payment_url`, data);
  }

  changeStatusOrder(idOrder: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create_payment_url`, idOrder);
  }

  changeStatusPayment(idOrder: any): Observable<any> {
    const data = {
      idOrder: idOrder
    }
    return this.http.post(`${this.apiUrl}/changeStatusPayment`, data);
  }
}
