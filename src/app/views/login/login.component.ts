import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { DisableControlDirective } from '../../directives/disable-control.directive';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, RouterModule, ReactiveFormsModule, DisableControlDirective,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  errorMessage: string | undefined;

  loading: boolean = false;

  loginForm: FormGroup = this.formBuilder.group({
    email: ['',[Validators.required,Validators.minLength(3),Validators.maxLength(200),Validators.email] ],
    password: ['', Validators.required]
  });

  constructor(private formBuilder: FormBuilder, private authService: AuthService,private router: Router){}

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  submit(){
    this.loading = true;

    if (this.loginForm.invalid){
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (result) => {
        // console.log("Result : " , result);
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        if (err.error && err.error.message){
          this.errorMessage = err.error.message;
        }else{
          console.error("Login error: " , err);
        }
      }
    })
  }
  
}
