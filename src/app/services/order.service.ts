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
    return this.http.get<any>(`http://${environment.HOST}:${environment.PORT}/api/orderView?orderId=${orderId}`);
  }
}
