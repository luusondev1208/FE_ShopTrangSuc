import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private apiUrl = 'http://localhost:5000/api/coupon';
  constructor(private http: HttpClient) { }

  checkCode(code: string): Observable<any> {

    return this.http.post(`${this.apiUrl}`, code)
  }

  getCouponByDiscount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getCouponByDiscount`)
  }
}
