import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  private API_URL = 'http://localhost:5000/api/category';
  Token = JSON.parse(localStorage.getItem('accessToken') || '{}');
  private httpOptions = {
    headers: new HttpHeaders().set(
      'Authorization', `Bearer ${this.Token}`
    )
  };

  constructor(private http: HttpClient) { }



  getCategories(): Observable<any> {
    return this.http.get<any>(this.API_URL, this.httpOptions);
  }

  getCategory(id: string): Observable<any> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<any>(url, this.httpOptions);
  }

  addCategory(category: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/add`, category, this.httpOptions);
  }

  // updateCategory(category: any): Observable<any> {
  //   return this.http.put<any>(`${this.API_URL}/${category.pid}`, category, this.httpOptions
  //   );
  // }
  updateCategory(category: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${category.id}`, category, this.httpOptions);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`, this.httpOptions);
  }

  getAllCategory(): Observable<any> {
    return this.http.get<any>(`http://localhost:5000/api/blogcategory/`, this.httpOptions);
  }
  getProductsByCategoryId(categoryId: string): Observable<any> {
    const url = `http://localhost:5000/api/category/${categoryId}/products`;
    return this.http.get(url);
  }
}