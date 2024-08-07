import { Component,  OnDestroy,  OnInit, output,  } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';
import { MyProfilePageViewEnum } from '../../../enums/MyProfilePageViewEnum';

@Component({
  selector: 'app-my-account-sideBar',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterOutlet, RouterModule, FormsModule],
  templateUrl: './my-account-sideBar.component.html',
  styleUrl: './my-account-sideBar.component.css'
})
export class MyAccountSideBarComponent implements OnInit{
  pageView: string = "";
  pageViewChange = output<string>()  

  viewEnum: typeof MyProfilePageViewEnum = MyProfilePageViewEnum;

  message: string = "";
  user: User | undefined;
  
    // OutputEmitterRef<string>   

  constructor(private productService: ProductService, private authService: AuthService, private route: ActivatedRoute){}


  ngOnInit(): void {
    // const userActivated = this.route.snapshot.queryParamMap.get('userActivated') !== null ? this.route.snapshot.queryParamMap.get('userActivated') as string : undefined;

    // console.log("userActivated: ", userActivated);
    this.pageView = MyProfilePageViewEnum.Orders;
    this.pageViewChange.emit(this.pageView); 

    this.authService.user.subscribe({
      next: (usr)=>{
        if (usr){
          this.user = usr;

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



