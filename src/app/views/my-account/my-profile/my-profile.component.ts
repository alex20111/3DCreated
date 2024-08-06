import { Component, output } from '@angular/core';
import { MyAccountSideBarComponent, PageViewEnum } from "../my-account-sideBar/my-account-sideBar.component";
import { ChangePasswordComponent } from "../../auth-view/change-password/change-password.component";

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [MyAccountSideBarComponent, ChangePasswordComponent],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {

  currentView: string = "";
  viewEnum: typeof PageViewEnum = PageViewEnum;

  newView(event: any){
   this.currentView = event;
    console.log("newView: " , event)
  }

}
