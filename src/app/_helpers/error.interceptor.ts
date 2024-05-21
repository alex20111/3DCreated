import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // console.log("Error interceptor: " , request);


        return next.handle(request).pipe(
            catchError(err => {
                console.log("ErrorInterceptor: ", err);
                if ([401, 403].includes(err.status)) {
                    // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                    if (err.error.message &&
                        (err.error.message === 'Incorrect email or password')
                    ) {
                        console.log("wrong credentials");
                        return throwError(() => err);
                    }
                    this.authService.logout();
                }
                // const error = err.error.message || err.statusText;
                return throwError(() => err);
            }))
    }
}