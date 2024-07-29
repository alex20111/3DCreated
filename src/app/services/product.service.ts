import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  host: string = 'localhost';
  port: string = '3000';

  constructor(private http: HttpClient) { }


  listProduct(query: any): Observable<any>{
    // return this.http.get<any>(`http://${this.host}:${this.port}/getProductList/?title=query&bob=patate`);

    if (query){
      return this.http.get<any>(`http://${this.host}:${this.port}/api/getProductList/?${query}`);
    }
    return this.http.get<any>(`http://${this.host}:${this.port}/api/getProductList/`);
    
  }

  displayProduct(productId: string): Observable<any>{
    return this.http.get<any>(`http://${this.host}:${this.port}/api/displayProduct/${productId}`);
  }


  loadProductsBycategories(catgId: any): Observable<any>{
    return this.http.get<any>(`http://${this.host}:${this.port}/api/productsCategories/${catgId}`);
  }

  getCategoryList(): Observable<any>{
    return this.http.get<any>(`http://${this.host}:${this.port}/api/categories/`);
  }

}
