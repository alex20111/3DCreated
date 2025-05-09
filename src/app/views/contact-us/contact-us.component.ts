import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Recaptcha3Service } from '../../services/recaptcha3.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { DisableControlDirective } from '../../directives/disable-control.directive';
import { MiscService } from '../../services/misc.service';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [RouterOutlet, RouterModule, ReactiveFormsModule, DisableControlDirective,CommonModule, TranslocoModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent implements OnInit, OnDestroy, AfterViewInit{

  submitted: boolean = false;
  errorMsg: string = "";
  successMsg: string = "";

  contactUsForm: FormGroup =  this.formBuilder.group({
    fullname: ['',[ Validators.required,Validators.minLength(3),Validators.maxLength(255)]],
    email: ['',[Validators.required,Validators.minLength(3),Validators.maxLength(200),Validators.email] ],
    message: ['', [Validators.required,Validators.minLength(3)]]
    }
  );

  constructor(private formBuilder: FormBuilder,
    private miscService: MiscService,
    private captCha3: Recaptcha3Service){}

  ngAfterViewInit(): void {
    // console.log("after view init", new Date());
    setTimeout(() => {
      const captChatPos = Array.from(document.getElementsByClassName('grecaptcha-badge') as HTMLCollectionOf<HTMLElement>);

      // console.log("captChatPos: " , captChatPos, new Date());
      captChatPos.forEach(element=> {  element.style.bottom = "90px"});
    }, 500);
      
  }

  ngOnInit(): void {
    this.captCha3.init(environment.CAPTCHA_SITE_KEY);
  }
  ngOnDestroy(): void {
    this.captCha3.destroy();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.contactUsForm.controls;
  }

  submitContactUs(){

    console.log("this.contactUsForm.invalid " , this.contactUsForm.invalid);
    if (this.contactUsForm.invalid){
      return;
    }
    this.submitted = true;
    console.log("Submitted");

    this.captCha3.getToken("ContactUsAction").then(token => {
      // console.log("tokennnnnn: " , token);
      // console.log("Type of: " , typeof token);
      const formData = new FormData();
      formData.append('fullname', this.contactUsForm.get('fullname')!.value);
      formData.append('email', this.contactUsForm.get('email')!.value);
      formData.append('message', this.contactUsForm.get('message')!.value);
      formData.append('capChaToken', token);

      this.miscService.sendContactUs(formData).subscribe({
        next: (result)=> {
          // console.log("signup: ", result);
          this.submitted = false;
          this.successMsg = result.message;
        },
        error: (err) => {
          // console.error("signup: ", err);
          this.errorMsg = err.error.message;
          this.submitted = false;
        }
      });
    }, error => {
    console.log('err ',error);
    this.submitted = false;
    this.errorMsg = "Error, try again later";
  });
  }

  click1(){
    const colorChange = Array.from(document.getElementsByClassName('grecaptcha-badge') as HTMLCollectionOf<HTMLElement>);

    console.log("colorrr: " , colorChange);
    colorChange.forEach(element=> { console.log("element: ", element.style); element.style.bottom = "90px"});    //(element.style as any)["bottom"] = "90px"}

    // const bg = document.querySelector(".grecaptcha-badge");

    // console.log(bg?.attributes);
  }
}
