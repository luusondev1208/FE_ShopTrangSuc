import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private API_URL = "http://localhost:5000/api/blog"
  Token = JSON.parse(localStorage.getItem('accessToken') || '{}');
  private httpOptions = {
    headers: new HttpHeaders().set(
      'Authorization', `Bearer ${this.Token}`
    )
  };
  constructor(private http: HttpClient) { }
  getBlog():Observable<any>{
    return this.http.get<any>(this.API_URL)
  }
  getBlogid(id:string):Observable<any>{
    const url=`http://localhost:5000/api/blog/one/${id}`
     return this.http.get<any>(url)
   }
  
   addBlog(blog: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/add`, blog, this.httpOptions);
  }

  updateBlog(blog: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${blog.id}`, blog, this.httpOptions);
  }
 
  deleteBlog(id: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`, this.httpOptions);
  }
}
