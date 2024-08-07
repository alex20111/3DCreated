;import { NgTemplateOutlet } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightToBracket, faCartShopping, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Message, MessagesService } from '../../services/messages.service';
import { PageNameEnum } from '../../enums/PageNameEnum';
import { MyAccountSideBarComponent } from "../my-account/my-account-sideBar/my-account-sideBar.component";
import { MyProfilePageViewEnum } from '../../enums/MyProfilePageViewEnum';


@Component({
  selector: 'app-top-menu',
  standalone: true,
  imports: [NgTemplateOutlet, FontAwesomeModule, RouterOutlet, RouterModule, NgbNavModule, MyAccountSideBarComponent],
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.css'
})
export class TopMenuComponent implements OnInit {
  tabActive = 1;
  // pageNameEnum: typeof PageNameEnum = PageNameEnum;

  // currentPage: string = "";
  // currentView: string = "";
  faArrowRightToBracket = faArrowRightToBracket;
  faCartShopping = faCartShopping;
  faUser = faUser;
  faUserPlus = faUserPlus

  user: User| undefined = undefined;
  cart: Cart = {} as Cart;


  constructor(private autService: AuthService, 
    private cartService: CartService,
     private router: Router,) { }

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
    });

    // this.messageService.messageEmitter.subscribe({
    //   next: (msg: Message) => {
    //     console.log("Message service recieved in top menu: " , msg);
    //     if (msg.key === "page"){
    //       this.currentPage = msg.value;
    //     }
    //   }
    // })
  }

  // newView(event: any){
  //  if (event === MyProfilePageViewEnum.chPassword){
  //   this.router.navigate(['/changePassword']);
  //  }else if (event === MyProfilePageViewEnum.Profile){
  //   this.router.navigate(['/myProfile/info']);
  //  }
   
  //  }

  logout(){
    this.autService.logout();
  }





}
