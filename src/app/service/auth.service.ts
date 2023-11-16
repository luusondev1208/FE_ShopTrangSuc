import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }
  private API_Url = `http://localhost:5000/api/user`;
  register(user: any): Observable<any> {
    return this.http.post(`${this.API_Url}/register`, user)
  }
  loggin(user: any): Observable<any> {
    return this.http.post(`${this.API_Url}/login`, user)
  }
  sendEmail(email: string): Observable<any> {
    const url = `${this.API_Url}/forgotpassword?email=${email}`;
    return this.http.get(url);
  }
  logout(){
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");

  }

}
