import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { MessagesService } from './messages.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private LOGIN_TIME: string = "loginTime";

  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private msgService: MessagesService
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }
  public get userValue() {
    
    return this.userSubject.value;
  }


  signup(signupFormValues: any): Observable<any> {
    return this.http.post<any>(`http://${environment.HOST}:${environment.PORT}/api/signup`, signupFormValues);
  }

  login(loginInfo: any): Observable<any> {
    return this.http.post<any>(`http://${environment.HOST}:${environment.PORT}/api/login`, loginInfo).pipe(map(resp => {
      console.log("User:  ", resp);
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(resp.user));
      this.userSubject.next(resp.user);
      localStorage.setItem(this.LOGIN_TIME, new Date().getTime().toString());
      return resp;
    }));
  }

  updateLocalStorageUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }


  logout(isExpired: boolean) {
    console.log("Logout!!!, User expired: " , isExpired);
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem(this.LOGIN_TIME);
    this.userSubject.next(null);
    this.router.navigate(['/']);

    if (isExpired) {
      this.msgService.sendMessage({ key: "session", value: "expired" });
    }
  }

  resetPassword(email: any): Observable<any> {
    return this.http.post<any>(`http://${environment.HOST}:${environment.PORT}/api/resetPassword`, email);
  }

  changePasswordForReset(email: string, token: string, password: string, confirmPassword: string): Observable<any> {
    const rstEval: any = {
      email: email,
      token: token,
      password: password,
      confirmPassword: confirmPassword
    }
    return this.http.post<any>(`http://${environment.HOST}:${environment.PORT}/api/resetPassword/change`, rstEval);
  }

  changePassword(chPassword: any): Observable<any> {

    return this.http.post<any>(`http://${environment.HOST}:${environment.PORT}/api/changePassword/`, chPassword);

  }

  isUserExpired(): boolean {
    // https://gist.github.com/shaik2many/039a8efe13dcafb4a3ffc4e5fb1dad97
    var setupTime = localStorage.getItem(this.LOGIN_TIME);

    if (!setupTime) {
      return true;
    }

    const dateNow = new Date().getTime();
    const storedTime = parseInt(setupTime);
//23 hours
    if ((dateNow - storedTime) > environment.USER_SESSION_TIMEOUT) {

      // localStorage.setItem('setupTime', now);
      return true;
    }
    // var hours = 24; // Reset when storage is more than 24hours
    // var now = new Date().getTime();
    // var setupTime = localStorage.getItem('setupTime');
    // if (setupTime == null) {
    //     localStorage.setItem('setupTime', now)
    // } else {
    //     if(now-setupTime > hours*60*60*1000) {
    //         localStorage.clear()
    //         localStorage.setItem('setupTime', now);
    //     }
    // }

    return false;
  }

}
