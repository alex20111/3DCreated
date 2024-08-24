import { Component,  OnDestroy,  OnInit, output,  } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';
import { MyProfilePageViewEnum } from '../../../enums/MyProfilePageViewEnum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-account-sideBar',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterOutlet, RouterModule, FormsModule],
  templateUrl: './my-account-sideBar.component.html',
  styleUrl: './my-account-sideBar.component.css'
})
export class MyAccountSideBarComponent implements OnInit, OnDestroy{
  pageView: string = "";
  pageViewChange = output<string>()  

  viewEnum: typeof MyProfilePageViewEnum = MyProfilePageViewEnum;

  message: string = "";
  user: User | undefined;
  
  userSubscription: Subscription | undefined;
    // OutputEmitterRef<string>   

  constructor(private productService: ProductService, private authService: AuthService, private route: ActivatedRoute){}
  ngOnDestroy(): void {
    if (this.userSubscription){
      this.userSubscription.unsubscribe();
    }
  }


  ngOnInit(): void {
    const pageToShow = this.route.snapshot.queryParamMap.get('page') !== null ? this.route.snapshot.queryParamMap.get('page') as string : undefined;

    console.log("pageToShow: ", pageToShow);
    if (pageToShow){
      this.pageView = pageToShow;
    }else{
    this.pageView = MyProfilePageViewEnum.userInfo;
    }
    this.pageViewChange.emit(this.pageView); 

    this.userSubscription = this.authService.user.subscribe({
      next: (usr)=>{
        if (usr){
          this.user = usr;
          console.log("MyAccountSideBarComponent user " , usr)
        }
      }
  });
  }



  pageChange(view: string){
    console.log("view: " , view);
    // console.log(" this.pageView : " ,  this.pageView );
    // if (view === MyProfilePageViewEnum.Profile){
    //   console.log("hhhhhhhh")
    //   this.pageView = "profile";
    // }else{
      this.pageView = view;
    // }
    
    // console.log(" this.pageView : " ,  this.pageView );
    this.pageViewChange.emit(view); 
  }

  // clickCss(){
  //   // event.srcElement.classList.remove("rotate");
  //   // setTimeout(()=>{
  //     event.srcElement.classList.add("active");

  // }
}



