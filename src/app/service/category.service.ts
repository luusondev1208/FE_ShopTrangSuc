import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private API_URL = 'http://localhost:5000/api/category';
  constructor(private http: HttpClient) {}
  getCategories(): Observable<any> {
    return this.http.get<any>(this.API_URL);
  }
  getCategory(id: string): Observable<any> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<any>(url);
  }
  addCategory(category: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/add`, category);
  }

  updateCategory(category: any): Observable<any> {
    return this.http.put<any>(
      `${this.API_URL}/${category.id}`,
      category
    );
  }

  deleteCategory(id: string): Observable<any> {
    // const url = `${this.API_URL}/${id}`;
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }
}
