import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
private API_URL='http://localhost:5000/api/user';
  constructor(private http: HttpClient) { }
  getAllUser(): Observable<any> {
    return this.http.get<any>(this.API_URL);
  };

  getUser(id:string) :Observable<any>{
    const url=`${this.API_URL}/${id}`;
    return this.http.get<any>(url);
    
  };
  addUser(user:any):Observable<any>{
    return this.http.post<any>(`${this.API_URL}/add`,user)

  };
  updateUser(user:any):Observable<any>{
    return this.http.put<any>(`${this.API_URL}/${user.id}`,user)

  };
  deleteUser(id:string):Observable<any>{
    return this.http.delete<any>(`${this.API_URL}/${id}`)

  };



}
