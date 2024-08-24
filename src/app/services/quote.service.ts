import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor(private http: HttpClient) { }

  //on Quote screen, upload the STL file that the user added
  uploadStlFile(stlFile: any): Observable<any> {
    return this.http.post<any>(`http://${environment.HOST}:${environment.PORT}/api/uploadStlFile`, stlFile, { reportProgress: true, observe: "events", responseType: 'json' });
  }

  //send e-mails for the quotes that the user requested
  sendQuote(quote: any): Observable<any> {
    return this.http.post<any>(`http://${environment.HOST}:${environment.PORT}/api/submitQuote`, quote);
  }

  //admin , list all quotes.
  listAllQuotes(query: any): Observable<any> {
    return this.http.get<any>(`http://${environment.HOST}:${environment.PORT}/api/listAllQuotesWithQuery?${query}`);
  }

  //admin, download quote requested
  downloadSTLFile(fileName: string) {
    return this.http.get(`http://${environment.HOST}:${environment.PORT}/api/quoteStlFile?reqStlFile=${fileName}`, { responseType: 'blob' });
  }

  //admin
  updateQuote(fieldsToUpdate: any): Observable<any> {
    return this.http.post<any>(`http://${environment.HOST}:${environment.PORT}/api/updateQuote`, fieldsToUpdate);
  }

  getQuoteByReferenceId(refId: string): Observable<any> {
    return this.http.get<any>(`http://${environment.HOST}:${environment.PORT}/api/getQuote/${refId}`);
  }

}

