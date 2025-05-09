;import { NgTemplateOutlet } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightToBracket, faCartShopping, faGlobe, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { MyAccountSideBarComponent } from "../my-account/my-account-sideBar/my-account-sideBar.component";
import { MyProfilePageViewEnum } from '../../enums/MyProfilePageViewEnum';
import { TranslocoDirective, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { LanguageService } from '../../services/language.service';
import { Language } from '../../models/lang';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-top-menu',
  standalone: true,
  imports: [NgTemplateOutlet, FontAwesomeModule, RouterOutlet, RouterModule, NgbNavModule, MyAccountSideBarComponent,  TranslocoModule],
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.css'
})
export class TopMenuComponent implements OnInit, OnDestroy {

  viewEnum: typeof MyProfilePageViewEnum = MyProfilePageViewEnum;

  faArrowRightToBracket = faArrowRightToBracket;
  faCartShopping = faCartShopping;
  faUser = faUser;
  faUserPlus = faUserPlus
  faGlobe = faGlobe;

  user: User| undefined = undefined;
  cart: Cart = {} as Cart;
  langText: string = "Français";

  //subscriptions
  userSubscription: Subscription | undefined;
  langSubscription: Subscription | undefined;
  cartSubscription: Subscription | undefined;

  constructor(private autService: AuthService, 
    private cartService: CartService,
    private translocoService: TranslocoService,
    private langService: LanguageService) { }
  ngOnDestroy(): void {
    if (this.userSubscription){
      this.userSubscription.unsubscribe();
    }
    if (this.langSubscription){
      this.langSubscription.unsubscribe();
    }
    if (this.cartSubscription){
      this.cartSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.userSubscription = this.autService.user.subscribe({
      next: (obUser) => {
        // console.log("topBarUser!!");
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

   this.cartSubscription =  this.cartService.cart.subscribe({
      next: (cart)=> {
        if (cart){
           this.cart = cart;
        }else{
          this.cart = {} as Cart;
        }
      }
    });

    this.langSubscription = this.langService.lang.subscribe({
      next: (lang)=> {
        if (lang?.locale === 'fr'){
          this.langText = "English";
        }else{
          this.langText = "Français";
        }
      }
    });
  
  }
 

  logout(){
    this.autService.logout(false);
  }

  lang(){
   const currLang =  this.langService.languageValue;

   if (currLang){
      if (currLang.locale === 'en'){
        currLang.locale = 'fr';
        this.translocoService.setActiveLang('fr');
      }else{
        currLang.locale = 'en';
        this.translocoService.setActiveLang('en');
      }
      this.langService.savelang(currLang);
    }

  }
}
