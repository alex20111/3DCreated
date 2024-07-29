import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MustMatch } from '../../../validator/mustMatchValidator';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DisableControlDirective } from '../../../directives/disable-control.directive';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [RouterOutlet, RouterModule, ReactiveFormsModule, DisableControlDirective, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit{
  submitted: boolean = false;
  forgotPassword: boolean = false;

  resetMessage: string = "";
  errorResetMessage: string = "";
  email: string = "";
  token: string = "";

  // StrongPasswordRegx: RegExp =
  //   /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  chPassForm: FormGroup = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(environment.PASS_REGEX)]],
    confirmPassword: ['', [Validators.required]]
  },
    {
      validators: MustMatch('password', 'confirmPassword')
    }
  );

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    
    console.log("Parameters: " , this.route.snapshot.queryParamMap);
    this.email = this.route.snapshot.queryParamMap.get('email') !== null ? this.route.snapshot.queryParamMap.get('email') as string : "";
    this.token = this.route.snapshot.queryParamMap.get('token') !== null ? this.route.snapshot.queryParamMap.get('token') as string : "";

    console.log("Token: " , this.token);
    console.log("email: " , this.email);

    if (this.token.length > 0 && this.email.length > 0){
      console.log("evaluate");
      this.forgotPassword = true;
     
    }else{
      this.forgotPassword = false;
    }


  }

  get f(): { [key: string]: AbstractControl } {
    return this.chPassForm.controls;
  }

  submit(){

    if (this.chPassForm.invalid){
      return;
    }
    this.submitted = true;

    if (this.forgotPassword){
      this.authService.changePasswordForReset(this.email, this.token, this.chPassForm.get('password')!.value, this.chPassForm.get('confirmPassword')!.value).subscribe({
        next: (result)=> {
          // this.resetMessage = "Password reset success";
          console.log("eval reset response : ", result);
          this.resetMessage = result.message;
          this.submitted = false;

        },
        error: (err) => {
          console.error("Error evaluate reset: ", err);
          // this.errorMessage = "Password reset error";
          this.errorResetMessage = err.error.message;
          this.submitted = false;
        }
      });
    }else{

    }

    // this.authService.signup(this.chPassForm.value).subscribe({
    //   next: (result)=> {
    //     console.log("signup: ", result);
    //     this.submitted = false;
    //   },
    //   error: (err) => {
    //     console.error("signup: ", err);
    //   }
    // });

  }

}
