import { Component, HostListener, OnDestroy, OnInit, output } from '@angular/core';
import { MyAccountSideBarComponent } from "../my-account-sideBar/my-account-sideBar.component";
import { ChangePasswordComponent } from "../../auth-view/change-password/change-password.component";
import { QuoteListComponent } from "../quote-list/quote-list.component";
import { MyProfilePageViewEnum } from '../../../enums/MyProfilePageViewEnum';
import { NgbAccordionModule, NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { faCaretDown, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrderListComponent } from "../order-list/order-list.component";
import { MyInfoComponent } from "../my-info/my-info.component";
import { QuoteSearchComponent } from "../quote-search/quote-search.component";
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [MyAccountSideBarComponent, ChangePasswordComponent,
     QuoteListComponent, NgbCollapseModule, NgbAccordionModule,
      FontAwesomeModule, OrderListComponent, MyInfoComponent,
       QuoteSearchComponent, TranslocoModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit{
  width: number = 0;
  isCollapsed = true;

  faCaretDown = faCaretDown;
  faCaretLeft = faCaretLeft;

  currentView: string = "";
  viewEnum: typeof MyProfilePageViewEnum = MyProfilePageViewEnum;

  ordRefresh = "";

  constructor(){}

  ngOnInit(): void {
   this.width = window.innerWidth;
   this.currentView = this.viewEnum.userInfo; 
  }


  newView(event: any){
    if (event === MyProfilePageViewEnum.Orders){ //to force the page to refresh for orders on the client
      let r = (Math.random() + 1).toString(36).substring(7);
      this.ordRefresh = r;
    }
   this.currentView = event;
   this.isCollapsed = true;
    console.log("MyProfileComponent newView(func): " , event)
  }

  

	@HostListener('window:resize', ['$event'])
	onResize(event:any) {
		this.width = event.target.innerWidth;

	}

}
