import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private API_URL = "http://localhost:5000/api/coupon"
  Token = JSON.parse(localStorage.getItem('accessToken') || '{}');
  private httpOptions = {
    headers: new HttpHeaders().set(
      'Authorization', `Bearer ${this.Token}`
    )
  };
  constructor(private http: HttpClient) { }
  getAll():Observable<any>{
    const url=`http://localhost:5000/api/coupon/getAll/`
     return this.http.get<any>(url)
  }
  getCouponid(id:string):Observable<any>{
    const url=`http://localhost:5000/api/coupon/getOne/${id}`
     return this.http.get<any>(url)
   }
  
   addCoupon(coupon: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/add`, coupon, this.httpOptions);
  }

  updateCoupon(coupon: any): Observable<any> {
    console.log(coupon);
    
    return this.http.put<any>(`${this.API_URL}/update/${coupon.id}`, coupon, this.httpOptions);
  }
 
  deleteCoupon(id: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`, this.httpOptions);
  }
}
