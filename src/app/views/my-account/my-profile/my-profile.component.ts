import { Component, OnDestroy, OnInit, output } from '@angular/core';
import { MyAccountSideBarComponent } from "../my-account-sideBar/my-account-sideBar.component";
import { ChangePasswordComponent } from "../../auth-view/change-password/change-password.component";
import { QuoteListComponent } from "../quote-list/quote-list.component";
import { MyProfilePageViewEnum } from '../../../enums/MyProfilePageViewEnum';
import { NgbAccordionModule, NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { faCaretDown, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrderListComponent } from "../order-list/order-list.component";
import { MyInfoComponent } from "../my-info/my-info.component";

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [MyAccountSideBarComponent, ChangePasswordComponent, QuoteListComponent, NgbCollapseModule, NgbAccordionModule, FontAwesomeModule, OrderListComponent, MyInfoComponent],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit{
  isCollapsed = true;

  faCaretDown = faCaretDown;
  faCaretLeft = faCaretLeft;

  currentView: string = "";
  viewEnum: typeof MyProfilePageViewEnum = MyProfilePageViewEnum;

  constructor(){}
  // ngOnDestroy(): void {
  //   const msg: Message = {
  //     key: "page",
  //     value: ""
  //   }
  //   this.messageService.sendMessage(msg);
  // }

  ngOnInit(): void {
    
    // const msg: Message = {
    //   key: "page",
    //   value: PageNameEnum.MyProfile
    // }
    // this.messageService.sendMessage(msg);
  }


  newView(event: any){
   this.currentView = event;
   this.isCollapsed = true;
    console.log("newView: " , event)
  }

}
