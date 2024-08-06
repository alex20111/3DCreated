import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightToBracket   } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit{
  faArrowRightToBracket = faArrowRightToBracket;

  //form 
  errorMessage: string = '';
  successMessage:string = "";
  submitted: boolean = false;
  // displayForm: boolean = true;

  //reset
  // resetSucess: boolean = false;
  // resetMessage: string = "";

  forgotPassForm: FormGroup = this.formBuilder.group({
    email: ['',[Validators.required,Validators.minLength(3),Validators.maxLength(200),Validators.email] ]
  })

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router){}
  ngOnInit(): void {
    if (this.authService.userValue){
      this.router.navigate(['/']);
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.forgotPassForm.controls;
  }

  

  submit(){
    if (this.forgotPassForm.invalid){
      return;
    }
    this.submitted = true;

    this.authService.resetPassword(this.forgotPassForm.value).subscribe({
      next: (result)=> {
        // console.log("forgot password sent : ", result);
        this.submitted = false;
        this.successMessage = result.message;
      },
      error: (err) => {
        // console.error("forgot password sent: ", err);
        this.errorMessage = err.error.message;
        this.submitted = false;
      }
    })


  }
}
