import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }


  viewUserOrder(orderId: any): Observable<any> {
    return this.http.get<any>(`${environment.HOST_PORT}/api/orderView?orderId=${orderId}`);
  }

  loadAllOrders(query: any): Observable<any> {
    return this.http.get<any>(`${environment.HOST_PORT}/api/allOrders?${query}`);
  }
}
