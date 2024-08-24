import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  host: string = 'localhost';
  port: string = '3000';

  constructor(private http: HttpClient) { }


  listProduct(query: any): Observable<any>{
    if (query){
      return this.http.get<any>(`http://${environment.HOST}:${environment.PORT}/api/getProductList/?${query}`);
    }
    return this.http.get<any>(`http://${environment.HOST}:${environment.PORT}/api/getProductList/`);
    
  }

  displayProduct(productId: string): Observable<any>{
    return this.http.get<any>(`http://${environment.HOST}:${environment.PORT}/api/displayProduct/${productId}`);
  }


  loadProductsBycategories(catgId: any): Observable<any>{
    return this.http.get<any>(`http://${environment.HOST}:${environment.PORT}/api/productsCategories/${catgId}`);
  }

  getCategoryList(): Observable<any>{
    return this.http.get<any>(`http://${environment.HOST}:${environment.PORT}/api/categories/`);
  }

}
