import { Component, Input, OnInit, output, Output, } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-account-sideBar',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterOutlet, RouterModule, FormsModule],
  templateUrl: './my-account-sideBar.component.html',
  styleUrl: './my-account-sideBar.component.css'
})
export class MyAccountSideBarComponent implements OnInit{
  pageView: string = "profile";
  pageViewChange = output<string>()  

  viewEnum: typeof PageViewEnum = PageViewEnum;

  message: string = "";
  
    // OutputEmitterRef<string>   

  constructor(private productService: ProductService, private authService: AuthService, private route: ActivatedRoute){}


  ngOnInit(): void {
    const userActivated = this.route.snapshot.queryParamMap.get('userActivated') !== null ? this.route.snapshot.queryParamMap.get('userActivated') as string : undefined;

    console.log("userActivated: ", userActivated);
  }

  pageChange(view: string){
    this.pageView = view;
    this.pageViewChange.emit(view); 
  }

  // clickCss(){
  //   // event.srcElement.classList.remove("rotate");
  //   // setTimeout(()=>{
  //     event.srcElement.classList.add("active");

  // }
}

export enum PageViewEnum {
  Quotes = "quotesList",
  Profile = "profile",
  Orders = "orders",
  chPassword = "chPassword"
}