import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MiscService {

  constructor(private http: HttpClient) { }

  //on Quote screen, upload the STL file that the user added
  sendContactUs(contactUsForm: any): Observable<any> {
    return this.http.post<any>(`${environment.HOST_PORT}/api/contactUs`, contactUsForm);
  }
}
