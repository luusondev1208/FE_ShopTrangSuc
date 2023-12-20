import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';

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
  deleteFeback(id: string): Observable<any> {
    console.log(id)
    return this.http.delete<any>(`http://localhost:5000/api/feedback/${id}`)
  }
  
  updateFeeback(feeback: any): Observable<any> {
    return this.http.put<any>(`http://localhost:5000/api/feedback/${feeback.id}`, feeback);
  }

}
