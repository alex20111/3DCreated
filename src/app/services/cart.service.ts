import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../models/cart';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  private cartSubject: BehaviorSubject<Cart | null>;
  public cart: Observable<Cart | null>;

  constructor(
    private http: HttpClient
  ) {
    this.cartSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('cart')!));
    this.cart = this.cartSubject.asObservable();
  }
  public get getCartValue() {
    return this.cartSubject.value;
  }

  addCart(cart: Cart){
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartSubject.next(cart);
  }
  emptyCart(){
    localStorage.removeItem('cart');
    this.cartSubject.next(null);
  }

  producyById(productId: string): Observable<any>{
    return this.http.get<any>(`http://${environment.HOST}:${environment.PORT}/api/getProductForCart/${productId}`);
    
  }

  pay(cart: any): Observable<any>{
    return this.http.post<any>(`http://${environment.HOST}:${environment.PORT}/api/addOrder`, cart); 
  }

}
