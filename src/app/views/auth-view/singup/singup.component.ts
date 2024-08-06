import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DisableControlDirective } from '../../../directives/disable-control.directive';
import { MustMatch } from '../../../validator/mustMatchValidator';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-singup',
  standalone: true,
  imports:  [RouterOutlet, RouterModule, ReactiveFormsModule, DisableControlDirective,CommonModule],
  templateUrl: './singup.component.html',
  styleUrl: './singup.component.css'
})
export class SingupComponent {

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

  constructor(private formBuilder: FormBuilder, private authService: AuthService){}

  get f(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }

  submit(){

    if (this.signupForm.invalid){
      return;
    }
    this.submitted = true;

    this.authService.signup(this.signupForm.value).subscribe({
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


  }
}
