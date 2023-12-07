import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http:HttpClient) { }


  get ():Observable<any> {
    return this.http.get<any>("http://localhost:5000/api/feedback")
  }
  create (data:any):Observable<any> {
    return this.http.post<any>("http://localhost:5000/api/feedback",data)
  }
  detail (id:string):Observable<any> {
    return this.http.get<any>(`http://localhost:5000/api/feedback/${id}`)
  }
  getFebacks(feedbackId: string[]): Observable<any> {
    // console.log(feedbackId);
    
    return this.http.post<any>((`http://localhost:5000/api/`), { feedbackId });
  }
}
