import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Cart, cartProduct } from '../../models/cart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  toCheckout: boolean = false;

  productId: string | undefined = undefined;
  cart: Cart = {} as Cart;
  totalPrice: number = 0;

  constructor(private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    //when a param id, add to cart
    if (paramId) {
      console.log("Cart: Param id: ", paramId);
      this.productId = paramId;

      //if we have a cart, add to it
      if (this.cartService.getCartValue) {
        //verify if the cart item exist.
        console.log("this.cartService.getCartValue " , this.cartService.getCartValue);
        this.cart = this.cartService.getCartValue;

        const cartIdx = this.cart.cartProducts.findIndex((i: any) => i.productId.toString() === paramId);
        // console.log(cartIdx);
        if (cartIdx > -1) {
          const cartItem = this.cart.cartProducts[cartIdx]; 
          this.cart.finalPrice = this.cart.finalPrice + cartItem.productPrice;          
          cartItem.productQuantity++;
          cartItem.totalPrice = cartItem.productQuantity * cartItem.productPrice;
          this.cartService.addCart(this.cart);
        } else {
          //add new item.
          this.addNewProductToCart(paramId);
        }
      }else {
        console.log("add new cart3 - ", paramId);
        this.addNewProductToCart(paramId);
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
    this.cart.cartProducts.splice(indx, 1);   

    if (this.cart.cartProducts.length === 0) {
      this.cartService.emptyCart();
      this.cart = {} as Cart
     }else{
      //update total price
      this.cartService.addCart(this.cart);
      let tot = 0;
      this.cart.cartProducts.forEach( ci => {
        tot = tot + (ci.productPrice * ci.productQuantity);
      });
      this.cart.finalPrice = tot;
     }
  }
  addProductQtr(idx: any) {

    const cartItem = this.cart.cartProducts[idx];
    if (cartItem) {
      this.cart.finalPrice = this.cart.finalPrice + cartItem.productPrice;          
      cartItem.productQuantity++;
      cartItem.totalPrice = cartItem.productQuantity * cartItem.productPrice;
      this.cartService.addCart(this.cart);
    }
  }
  removeProductQtr(idx: any) {
    const cartItem = this.cart.cartProducts[idx];
    if (cartItem.productQuantity > 0) {
      this.cart.cartProducts[idx].productQuantity --;
      this.cart.finalPrice = this.cart.finalPrice - cartItem.productPrice;
      cartItem.totalPrice = cartItem.totalPrice! -  cartItem.productPrice;
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


  private addNewProductToCart(productId: string) {
    this.cartService.producyById(productId).subscribe({
      next: (result) => {
        console.log("this.cart:  ", this.cart);
        //add new item.
        const product = result.product;
        console.log(result);

        if (Object.keys(this.cart).length > 0) {
          this.cart.finalPrice = this.cart.finalPrice + product.price;

          this.cart.cartProducts.push({
            productId: product.id,
            productName: product.title,
            productQuantity: 1,
            productPrice: product.price,
            imageUrl: product.coverImageThumb,
            catgName: result.categoryName,
            totalPrice: product.price
          });

        } else {
          console.log("!!!!!!! new cart");
          let cartProductList: cartProduct[] = [];
          cartProductList.push({
            productId: product.id,
            productName: product.title,
            productQuantity: 1,
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

}


