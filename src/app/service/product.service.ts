import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private API_URL = 'http://localhost:5000/api/product';
  Token = JSON.parse(localStorage.getItem('accessToken') || '{}');
  private httpOptions = {
    headers: new HttpHeaders().set('Authorization', `Bearer ${this.Token}`),
  };
  constructor(private http: HttpClient) { }
  getProducts(page: any, limit: any): Observable<any> {
    return this.http.get<any>(
      `http://localhost:5000/api/product?page=${page}&limit=${limit}`
    );
  }

  getAdminProducts(page: any, limit: any): Observable<any> {
    return this.http.get<any>(
      `http://localhost:5000/api/product/getAdminProducts?page=${page}&limit=${limit}`
    );
  }

  getProduct(id: string): Observable<any> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<any>(url);
  }
  addProduct(product: any): Observable<any> {
    return this.http.post<any>(
      `${this.API_URL}/add`,
      product,
      this.httpOptions
    );
  }

  updateProduct(product: any): Observable<any> {
    return this.http.put<any>(
      `${this.API_URL}/${product.id}`,
      product,
      this.httpOptions
    );
  }

  deleteProduct(id: string): Observable<any> {
    // const url = `${this.API_URL}/${id}`;
    return this.http.delete<any>(`${this.API_URL}/${id}`, this.httpOptions);
  }

  searchByName(title: string): Observable<any> {
    return this.http.get(`${this.API_URL}/search?title=${title}`);
  }

  getSizeOptions(id: string): Observable<any> {
    const url = `${this.API_URL}/sizes/${id}`;
    return this.http.get<any>(url);
  }

  addComent(comment: any): Observable<any> {
    return this.http.post<any>(
      `${this.API_URL}/ratings/add`,
      comment,
      this.httpOptions
    );
  }

  search(data: any): Observable<any> {
    return this.http.post<any>(
      'http://localhost:5000/api/product/search-product',
      data
    );
  }
  getFilteredProducts(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
  updateAssess(productId: string, assess: number): Observable<any> {
    return this.http.put<any>(
      `${this.API_URL}/${productId}/updateAssess`,
      { assess },
      this.httpOptions
    );
  }
}
