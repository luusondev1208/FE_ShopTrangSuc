import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  getOrderDetails(orderIds: string[]): Observable<any> {
    const url = `${this.apiUrl}/getOrder`; // Thêm "/getOrder" vào URL
    return this.http.post<any>(url, { orderIds });
  }
  // updateStatus(status:any): Observable<any> {
  //   return this.http.put<any>(`${this.apiUrl}/status`, status);
  // }
  
  updateOrderStatus(id: string, newStatus: string) {
    const url = `${this.apiUrl}/status/${id}`;
    const body = { status: newStatus }; // Dữ liệu cần gửi đi để cập nhật trạng thái

    return this.http.put(url, body); // Gửi yêu cầu PUT đến API
  }

  getAllOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAll`);
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
  updateOrderStatusUser(orderId: string, status: string): Observable<any> {
    const updateUrl = `${this.apiUrl}/updateStatusForuser/${orderId}`;
    const body = { status };

    return this.http.put(updateUrl, body);
  }
  deleteProduct(orderId: string, productId: string): Observable<any> {
    const url = `${this.apiUrl}/${orderId}/products/${productId}`;
    return this.http.delete(url);
  }
  getOrdersByStatus(status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.get(`${this.apiUrl}/filterByStatus`, { params });
  }

}
