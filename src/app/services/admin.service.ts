import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {



  constructor(private http: HttpClient) { }

  addProduct(product: any): Observable<any>{
    return this.http.post<any>(`http://${environment.HOST}:${environment.PORT}/api/admin/addProduct`, product);  
  }
  editProduct(product: any): Observable<any>{
    return this.http.post<any>(`http://${environment.HOST}:${environment.PORT}/api/admin/editProduct`, product);  
  }
  getProduct(id: number): Observable<any>{
    return this.http.get<any>(`http://${environment.HOST}:${environment.PORT}/api/admin/editProduct/${id}`);
  }


}
