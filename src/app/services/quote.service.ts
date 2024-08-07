import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  host: string = 'localhost';
  port: string = '3000';

  constructor(private http: HttpClient) { }

  //on Quote screen, upload the STL file that the user added
  uploadStlFile(stlFile: any): Observable<any> {
    return this.http.post<any>(`http://${this.host}:${this.port}/api/uploadStlFile`, stlFile, { reportProgress: true, observe: "events", responseType: 'json' });
  }

  //send e-mails for the quotes that the user requested
  sendQuote(quote: any): Observable<any> {
    return this.http.post<any>(`http://${this.host}:${this.port}/api/submitQuote`, quote);
  }

  //admin , list all quotes.
  listAllQuotes(query: any): Observable<any> {
    return this.http.get<any>(`http://${this.host}:${this.port}/api/listAllQuotesWithQuery?${query}`);
  }

  //admin, download quote requested
  downloadSTLFile(fileName: string) {
    return this.http.get(`http://${this.host}:${this.port}/api/quoteStlFile?reqStlFile=${fileName}`, { responseType: 'blob' });
  }

  updateQuote(fieldsToUpdate: any): Observable<any> {
    return this.http.post<any>(`http://${this.host}:${this.port}/api/updateQuote`, fieldsToUpdate);
  }


}

