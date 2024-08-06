import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  host: string = 'localhost';
  port: string = '3000';
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }
  public get userValue() {
    return this.userSubject.value;
  }


  signup(signupFormValues: any): Observable<any> {
    return this.http.post<any>(`http://${this.host}:${this.port}/api/signup`, signupFormValues);
  }

  login(loginInfo: any): Observable<any> {
    return this.http.post<any>(`http://${this.host}:${this.port}/api/login`, loginInfo).pipe(map(resp => {
      console.log("User:  ", resp);
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(resp.user));
      this.userSubject.next(resp.user);
      return resp;
    }));


  }

  logout() {
    console.log("Logout!!!");
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  resetPassword(email: any): Observable<any>{
    return this.http.post<any>(`http://${this.host}:${this.port}/api/resetPassword`, email);  
  }

  changePasswordForReset(email: string, token: string, password: string, confirmPassword: string): Observable<any>{
    const rstEval: any = {
      email: email,
      token: token,
      password: password,
      confirmPassword: confirmPassword
    }
    return this.http.post<any>(`http://${this.host}:${this.port}/api/resetPassword/change`, rstEval);  
  }

  changePassword(chPassword: any): Observable<any>{
  
    return this.http.post<any>(`http://${this.host}:${this.port}/api/changePassword/`, chPassword); 

  }

}
