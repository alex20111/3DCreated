import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  errorMessage: string = '';
  submitted: boolean = false;

  forgotPassForm: FormGroup = this.formBuilder.group({
    email: ['',[Validators.required,Validators.minLength(3),Validators.maxLength(200),Validators.email] ]
  })

  constructor(private formBuilder: FormBuilder){}

  get f(): { [key: string]: AbstractControl } {
    return this.forgotPassForm.controls;
  }

  submit(){
    if (this.forgotPassForm.invalid){
      return;
    }
    this.submitted = true;


  }
}
