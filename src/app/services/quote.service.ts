import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  host: string = 'localhost';
  port: string = '3000';

  constructor(private http: HttpClient) { }

  uploadStlFile(stlFile: any): Observable<any>{
    return this.http.post<any>(`http://${this.host}:${this.port}/api/uploadStlFile`, stlFile, {reportProgress : true, observe: "events", responseType:'json'});  
  }

  sendQuote(quote: any): Observable<any>{
    return this.http.post<any>(`http://${this.host}:${this.port}/api/submitQuote`, quote);  
  }

  listAllQuotes(status: any){
    return this.http.get<any>(`http://${this.host}:${this.port}/api/listAllQuotesWithQuery?status=${status}`);  
  }


  // upload(file: File): Observable<HttpEvent<any>> {
  //   const formData: FormData = new FormData();

  //   formData.append('file', file);

  //   const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
  //     reportProgress: true,
  //     responseType: 'json'
  //   });

  //   return this.http.request(req);
  // }

  // getFiles(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/files`);
  // }
}
