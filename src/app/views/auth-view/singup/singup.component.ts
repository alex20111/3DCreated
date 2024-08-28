import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DisableControlDirective } from '../../../directives/disable-control.directive';
import { MustMatch } from '../../../validator/mustMatchValidator';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { Recaptcha3Service } from '../../../services/recaptcha3.service';


@Component({
  selector: 'app-singup',
  standalone: true,
  imports:  [RouterOutlet, RouterModule, ReactiveFormsModule, DisableControlDirective,CommonModule],
  templateUrl: './singup.component.html',
  styleUrl: './singup.component.css'
})
export class SingupComponent implements OnInit, OnDestroy{

  submitted: boolean = false;
  accountCreated: boolean = false;

  successMsg: string = "";
  errorMsg: string = "";

  signupForm: FormGroup =  this.formBuilder.group({
    lastName: ['',[ Validators.required,Validators.minLength(3),Validators.maxLength(35)]],
    firstName:['', [ Validators.required,Validators.minLength(3),Validators.maxLength(35)]],
    email: ['',[Validators.required,Validators.minLength(3),Validators.maxLength(200),Validators.email] ],
    password: ['', [Validators.required,Validators.minLength(8), Validators.pattern(environment.PASS_REGEX)]],
    confirmPassword: ['', [Validators.required]]
    },
    {
      validators: MustMatch('password', 'confirmPassword')
    }
  );

  constructor(private formBuilder: FormBuilder,
     private authService: AuthService,
    private captCha3: Recaptcha3Service){}
  ngOnDestroy(): void {
    this.captCha3.destroy();
  }
  ngOnInit(): void {
    this.captCha3.init(environment.CAPTCHA_SITE_KEY);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }

  submit(){

    if (this.signupForm.invalid){
      return;
    }
    this.submitted = true;

    this.captCha3.getToken().then(token => {
      // console.log("tokennnnnn: " , token);
      // console.log("Type of: " , typeof token);
      const formData = new FormData();
      formData.append('lastName', this.signupForm.get('lastName')!.value);
      formData.append('firstName', this.signupForm.get('firstName')!.value);
      formData.append('email', this.signupForm.get('email')!.value);
      formData.append('password', this.signupForm.get('password')!.value);
      formData.append('confirmPassword', this.signupForm.get('confirmPassword')!.value);
      formData.append('capChaToken', token);

      this.authService.signup(formData).subscribe({
        next: (result)=> {
          console.log("signup: ", result);
          this.submitted = false;
          this.accountCreated = true;
          this.successMsg = result.message;
        },
        error: (err) => {
          console.error("signup: ", err);
          this.accountCreated = false;
          this.errorMsg = err.error.message;
        }
      });
    }, error => {
    console.log('err ',error)
  });

    


  }
}
