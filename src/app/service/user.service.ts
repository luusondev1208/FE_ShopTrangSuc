
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = 'http://localhost:5000/api/user';
  Token = JSON.parse(localStorage.getItem('accessToken') || '{}');
  private httpOptions = {
    headers: new HttpHeaders().set(
      'Authorization', `Bearer ${this.Token}`
    )
  };
  constructor(private http: HttpClient) { }
  getUsers(): Observable<any> {
    return this.http.get<any>(this.API_URL, this.httpOptions);

  }

  getUser(id: string): Observable<any> {
    const url = `${`http://localhost:5000/api/user/current`}/${id}`;
    return this.http.get<any>(url, this.httpOptions);
  }
  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`http://localhost:5000/api/user/?_id=${id}`, this.httpOptions);
  }
  // addProducts(product:any,  files: File[]): Observable<any> {
  //   return this.http.post<any>(`${this.API_URL}/add`, product); 
  // }
  addUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/add`, user, this.httpOptions);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put<any>(
      `${`http://localhost:5000/api/user/current`}`,
      user, this.httpOptions
    );
  }
  updatePass(data:any):Observable<any>{
    return this.http.put<any>(`${this.API_URL}/current/password`,data);
  
}
getFaverie(id: string): Observable<any> {
  const url = `${`http://localhost:5000/api/user/wishlist`}`;
  return this.http.get<any>(url, this.httpOptions);
}
addPRoductFaveries(id: any): Observable<any> {
  // console.log(id);
  // The second parameter should be the request body, not httpOptions
  return this.http.post<any>(`${this.API_URL}/addFavorite/${id}`, null, this.httpOptions);
}

deleteProFaveries(id: any): Observable<any> {
  // console.log(id);
  // The second parameter should be the request body, not httpOptions
  return this.http.delete<any>(`${this.API_URL}/delFavorite/${id}`, this.httpOptions);
}
}
