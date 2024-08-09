import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { UserInfoService } from '../../../services/user-info.service';

@Component({
  selector: 'app-my-info',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './my-info.component.html',
  styleUrl: './my-info.component.css'
})
export class MyInfoComponent implements OnInit{
  submitted: boolean = false;

  errorMessage: string  = "";
  message: string = "";

  userInfoForm: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(1)]],
    lastName: ['', [Validators.required, Validators.minLength(1)]],
    email: ['', [Validators.required]],
  }
  );

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private userService: UserInfoService){}
  ngOnInit(): void {
    const user = this.authService.userValue;
    if (user){
      this.userInfoForm.controls['email'].setValue(user.email);
      this.userInfoForm.controls['firstName'].setValue(user.firstName);
      this.userInfoForm.controls['lastName'].setValue(user.lastName);
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.userInfoForm.controls;
  }

  update(){

    this.errorMessage = "";
    this.message = "";

    if (this.userInfoForm.invalid){
      return;
    }

    this.submitted = true;

    this.userService.update(this.userInfoForm.value).subscribe({
      next: ( result) => {
        console.log("User info: " , result);
        this.message = result.message;
        let usr = this.authService.userValue;
        if (usr){
          usr.lastName = result.user.lastName;
          usr.firstName = result.user.firstName;
          usr.email = result.user.email;
          this.authService.updateLocalStorageUser(usr);
        }

        
        this.submitted = false;
      },
      error: (err) => {
        console.log("error: " , err);
        if (err.error.message){
          this.errorMessage = this.processError(err);
        }else{
          this.errorMessage = err.message;
        }
        
        this.submitted = false;
      }
    });


  }

  private processError(err: any): string {
    let ret = "";
   ret=  ret.concat(err.error.message + "\n");
    if (err.error.data){
      const data = err.error.data;
      for (let i = 0 ; i < data.length ; i ++){
        // console.log("el " , data[i]);
        ret =  ret.concat(data[i].msg + "\n");
      }        
    }
    console.log("rettt " , ret);
    return ret;
  }

}
