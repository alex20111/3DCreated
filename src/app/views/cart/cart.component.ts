import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Cart, cartProduct } from '../../models/cart';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DisableControlDirective } from '../../directives/disable-control.directive';
import { AuthService } from '../../services/auth.service';
import { MessagesService } from '../../services/messages.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
// import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DisableControlDirective, FontAwesomeModule, CommonModule, TranslocoModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  faCircleCheck = faCircleCheck;

  toCheckout: boolean = false;
  paySubmitted: boolean = false;

  productId: string | undefined = undefined;
  cart: Cart = {} as Cart;
  totalPrice: number = 0;

  payForm = new FormGroup({
    paySelection: new FormControl('stripe'),
  });

  constructor(private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    private msgService: MessagesService
  ) { }

  ngOnInit(): void {

    const paramId = this.route.snapshot.queryParamMap.get('productId') !== null ? this.route.snapshot.queryParamMap.get('productId') as string : undefined;

    const quantity = this.route.snapshot.queryParamMap.get('productQty') !== null ? this.route.snapshot.queryParamMap.get('productQty') as string : undefined;

    console.log("Param id: " , paramId, " QTY: " , quantity);

    // const paramId = this.route.snapshot.paramMap.get('id');
    // const paramId = this.route.snapshot.paramMap.get('quantity');
    //when a param id, add to cart
    if (paramId) {
      console.log("Cart: Param id: ", paramId);
      this.productId = paramId;

      //if we have a cart, add to it
      if (this.cartService.getCartValue) {
        //verify if the cart item exist.
        console.log("this.cartService.getCartValue ", this.cartService.getCartValue);
        this.cart = this.cartService.getCartValue;

        const cartIdx = this.cart.cartProducts.findIndex((i: any) => i.productId.toString() === paramId);
        // console.log(cartIdx);
        if (cartIdx > -1) {
          const cartItem = this.cart.cartProducts[cartIdx];
          this.cart.finalPrice = Number((this.cart.finalPrice + cartItem.productPrice).toFixed(2));
          if (quantity){
            cartItem.productQuantity = cartItem.productQuantity + parseInt(quantity);
          }else{
            cartItem.productQuantity++;
          }
          cartItem.totalPrice = Number((cartItem.productQuantity * cartItem.productPrice).toFixed(2));
          this.cartService.addCart(this.cart);
        } else {
          //add new item.
          this.addNewProductToCart(paramId, quantity);
        }
      } else {
        this.addNewProductToCart(paramId, quantity);
      }
    }
    //no param id, view cart
    else {
      if (this.cartService.getCartValue) {
        this.cart = this.cartService.getCartValue;
      }
    }

  }

  emptyCart() {
    this.cartService.emptyCart();
    this.cart = {} as Cart;
  }

  removeItem(indx: any) {
    if (!this.paySubmitted) {
      this.cart.cartProducts.splice(indx, 1);

      if (this.cart.cartProducts.length === 0) {
        this.cartService.emptyCart();
        this.cart = {} as Cart
      } else {
        //update total price
        this.cartService.addCart(this.cart);
        let tot = 0;
        this.cart.cartProducts.forEach(ci => {
          tot = tot + (ci.productPrice * ci.productQuantity);
        });
        this.cart.finalPrice = Number((tot).toFixed(2));
      }
    }
  }
  addProductQtr(idx: any) {

    const cartItem = this.cart.cartProducts[idx];
    if (cartItem) {
      this.cart.finalPrice = Number((this.cart.finalPrice + cartItem.productPrice).toFixed(2));;
      cartItem.productQuantity++;
      cartItem.totalPrice = Number((cartItem.productQuantity * cartItem.productPrice).toFixed(2));
      this.cartService.addCart(this.cart);
    }
  }
  removeProductQtr(idx: any) {
    const cartItem = this.cart.cartProducts[idx];
    if (cartItem.productQuantity > 0) {
      this.cart.cartProducts[idx].productQuantity--;
      this.cart.finalPrice = Number((this.cart.finalPrice - cartItem.productPrice).toFixed(2));
      cartItem.totalPrice = Number((cartItem.totalPrice! - cartItem.productPrice).toFixed(2));
      this.cartService.addCart(this.cart);
    }
  }

  countCartProductNumber(): number {
    let numberOfProduct = 0;
    this.cart.cartProducts.forEach((cp: any) => {
      numberOfProduct = numberOfProduct + cp.productQuantity;
    })
    return numberOfProduct;
  }


  private addNewProductToCart(productId: string, quantity: string | undefined) {
    this.cartService.producyById(productId).subscribe({
      next: (result) => {
        console.log("this.cart:  ", this.cart);
        //add new item.
        const product = result.product;
        console.log(result);

        if (Object.keys(this.cart).length > 0) {
          this.cart.finalPrice = Number((this.cart.finalPrice + product.price).toFixed(2));

          this.cart.cartProducts.push({
            productId: product.id,
            productName: product.title,
            productQuantity: quantity !== undefined ? parseInt(quantity) : 1,
            productPrice: product.price,
            imageUrl: product.coverImageThumb,
            catgName: result.categoryName,
            totalPrice: product.price
          });

        } else {
          let cartProductList: cartProduct[] = [];
          cartProductList.push({
            productId: product.id,
            productName: product.title,
            productQuantity: quantity !== undefined ? parseInt(quantity) : 1,
            productPrice: product.price,
            imageUrl: product.coverImageThumb,
            catgName: result.categoryName,
            totalPrice: product.price
          });

          const newCartProduct: Cart = {
            finalPrice: product.price,
            cartProducts: cartProductList
          }
          this.cart = newCartProduct;
        }
        // this.cartItems.push(newCart);

        console.log("this.cart ", this.cart);

        if (Object.keys(this.cart).length > 0)
          this.cartService.addCart(this.cart);

        console.log("this.cartService.getCartValue ", this.cartService.getCartValue);
      },

    });
  }
  transactionCompleted() {


    // this.cartService.createOrder(this.cart).subscribe({
    //   next: (result) => {
    //     console.log("result " , result);
    //     // this.toCheckout = false;
    //     // this.cartService.emptyCart();
    //     // this.cart = {} as Cart;
    //   },
    //   error: (err) => {
    //     console.log("Error : " , err);
    //   }
    // })
  }

  payment() {
    // console.log("this.cart: " , this.cart);
    // console.log("this.authService.userValue: " , this.authService.userValue);
    if (this.cart.cartProducts) {
      this.paySubmitted = true;

      if (!this.authService.userValue) {
        this.msgService.sendMessage({ key: "cart", value: "paymentForCart" });
        this.router.navigate(['/login']);

      } else {
        console.log("Ths cart: " , this.cart);

        this.cartService.pay(this.cart).subscribe({
          next: (result) => {
            console.log("result!! ", result);
            if (result.success) {
              window.location.href = result.url;
            } else {
              console.log("error : ", result);
            }
          },
          error: (err) => {
            console.error("errors : ", err);
          }
        });
      }
    }
  }









  emit() {
    this.msgService.sendMessage({ key: "session", value: "expired" });
  }





}


