import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MustMatch } from '../../../validator/mustMatchValidator';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
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
export class ChangePasswordComponent implements OnInit {
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

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    console.log("Parameters: ", this.route.snapshot.queryParamMap);
    this.email = this.route.snapshot.queryParamMap.get('email') !== null ? this.route.snapshot.queryParamMap.get('email') as string : "";
    this.token = this.route.snapshot.queryParamMap.get('token') !== null ? this.route.snapshot.queryParamMap.get('token') as string : "";

    console.log("Token: ", this.token);
    console.log("email: ", this.email);
    console.log("this.authService.userValue: ", this.authService.userValue);


    if (this.token.length > 0 && this.email.length > 0 && !this.authService.userValue) {
      console.log("evaluate");
      this.forgotPassword = true;

    } else if (this.authService.userValue) {
      this.forgotPassword = false;
    } else {
      this.router.navigate(['/login']);
    }


  }

  get f(): { [key: string]: AbstractControl } {
    return this.chPassForm.controls;
  }

  submit() {

    if (this.chPassForm.invalid) {
      return;
    }
    this.submitted = true;

    if (this.forgotPassword) {
      const pass = this.chPassForm.get('password')!.value;
      const cnfPass = this.chPassForm.get('confirmPassword')!.value;

      this.authService.changePasswordForReset(this.email, this.token, pass, cnfPass).subscribe({
        next: (result) => {
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
    } else {
      this.authService.changePassword(this.chPassForm.value).subscribe({
        next: (result) => {
          // this.resetMessage = "Password reset success";
          console.log("changePassword : ", result);
          this.resetMessage = result.message;
          this.submitted = false;

        },
        error: (err) => {
          console.error("Error changePassword: ", err);
          // this.errorMessage = "Password reset error";
          this.errorResetMessage = err.error.message;
          this.submitted = false;
        }
      });
    }


  }

}
