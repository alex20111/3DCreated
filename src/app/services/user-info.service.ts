import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  host: string = 'localhost';
  port: string = '3000';

  constructor(private http: HttpClient) { }


   //on Quote screen, upload the STL file that the user added
   update(userInfo: any): Observable<any> {
    return this.http.post<any>(`http://${this.host}:${this.port}/api/selfUpdateUser`, userInfo);
  }

  
}
