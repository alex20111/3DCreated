import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  host: string = 'localhost';
  port: string = '3000';

  constructor(private http: HttpClient) { }

  addProduct(product: any): Observable<any>{
    return this.http.post<any>(`http://${this.host}:${this.port}/admin/addProduct`, product);  
  }
  editProduct(product: any): Observable<any>{
    return this.http.post<any>(`http://${this.host}:${this.port}/admin/editProduct`, product);  
  }
  getProduct(id: number): Observable<any>{
    return this.http.get<any>(`http://${this.host}:${this.port}/admin/editProduct/${id}`);
  }


}
