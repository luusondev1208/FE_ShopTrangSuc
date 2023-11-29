import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BlogService {
private API_URL = "http://localhost:5000/api/blog"
  constructor(private http: HttpClient) { }
  getBlog():Observable<any>{
    return this.http.get<any>(this.API_URL)
  }
  getBlogid(id:string):Observable<any>{
    const url=`http://localhost:5000/api/blog/one/${id}`
     return this.http.get<any>(url)
   }
  
 
}
