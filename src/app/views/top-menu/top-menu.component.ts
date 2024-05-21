import { NgTemplateOutlet } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightToBracket, faCartShopping, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';


@Component({
  selector: 'app-top-menu',
  standalone: true,
  imports: [NgTemplateOutlet, FontAwesomeModule, RouterOutlet, RouterModule],
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.css'
})
export class TopMenuComponent implements OnInit, OnDestroy {

  faArrowRightToBracket = faArrowRightToBracket;
  faCartShopping = faCartShopping;
  faUser = faUser;
  faUserPlus = faUserPlus

  user: User| undefined = undefined;
  cart: Cart = {} as Cart;


  constructor(private autService: AuthService, private cartService: CartService) { }
  ngOnDestroy(): void {
  
  }
  ngOnInit(): void {
    this.autService.user.subscribe({
      next: (obUser) => {
        if (obUser) {
          this.user = obUser;
        }else{
          this.user = undefined;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });

    this.cartService.cart.subscribe({
      next: (cart)=> {
        if (cart){
           this.cart = cart;
        }
      }
    })
  }

  logout(){
    this.autService.logout();
  }





}
