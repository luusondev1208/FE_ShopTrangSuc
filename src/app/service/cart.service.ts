import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CartItem } from 'src/app/shared/model/cart';
import { HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart';

  constructor(private http: HttpClient) { }

  getCart(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getCartUser/${id}`);
  }

  getCartItemById(id: string): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/getCartItemById/${id}`);
  }

  removeCartItem(productId: string, id: string): Observable<any> {
    const data: any = {
      productId: productId
    }
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: data,
    };
    return this.http.delete(`${this.apiUrl}/remove/${id}`, options);
  }

  clearCart(_id: string): Observable<any> {
    const cartItem: any = {

    }
    return this.http.delete(`${this.apiUrl}/removeAll/${_id}`, cartItem);
  }

  updateCartItem(cartItem: CartItem): Observable<CartItem> {

    return this.http.put<CartItem>(`${this.apiUrl}/update`, cartItem);
  }
  addToCart(product: any, size: number, quantity: number, usserId: string): Observable<any> {

    const cartItem: any = {
      product: product,
      quantity: quantity,
      size: Number(size),
      userId: usserId,
    };

    return this.http.post<any>(`${this.apiUrl}/addToCart`, cartItem);
  }



}
