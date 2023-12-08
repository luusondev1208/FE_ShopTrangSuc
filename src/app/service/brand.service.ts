import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private API_URL = "http://localhost:5000/api/brand"
  Token = JSON.parse(localStorage.getItem('accessToken') || '{}');
  private httpOptions = {
    headers: new HttpHeaders().set(
      'Authorization', `Bearer ${this.Token}`
    )
  };
  constructor(private http: HttpClient) { }
  
  createBrand(brand: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/add`, brand, this.httpOptions);
  }
  getBrands(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }
  get(id: any): Observable<any[]> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }
  deleteBrand(id: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`, this.httpOptions);
  }
  updateBrand(blog: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${blog.id}`, blog, this.httpOptions);
  }
  getProductsByBrandId(brandId: string): Observable<any> {
    const url = `http://localhost:5000/api/brand/brand/${brandId}`;
    return this.http.get(url);
  }
}
