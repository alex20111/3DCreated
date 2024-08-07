import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-my-info',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './my-info.component.html',
  styleUrl: './my-info.component.css'
})
export class MyInfoComponent {
  submitted: boolean = false;

  userInfoForm: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(8)]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required]],
  }
  );

  constructor(private formBuilder: FormBuilder){}

  get f(): { [key: string]: AbstractControl } {
    return this.userInfoForm.controls;
  }

}
