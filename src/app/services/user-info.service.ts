import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {


  constructor(private http: HttpClient) { }


   //Update the user information
   update(userInfo: any): Observable<any> {
    return this.http.post<any>(`http://${environment.HOST}:${environment.PORT}/api/selfUpdateUser`, userInfo);
  }

  
}
