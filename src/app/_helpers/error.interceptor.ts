import { inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHandlerFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { MessagesService } from '../services/messages.service';
import { Router } from '@angular/router';

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
        const authService = inject(AuthService);
        const router = inject(Router);
    // console.log("ErrorInterceptor!!!!!: ", req);
            return next(req).pipe(
            catchError(err => {
          
                if ([401, 403].includes(err.status)) {
                    // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                    console.log("ErrorInterceptor!!!!!: ", err);
                    console.log("error status2: " , err.status)
                    if (err.error.message &&
                        (err.error.message === 'Incorrect email or password' ||
                            err.error.message === 'E-mail not validated.' 
                        )
                    ) {
                        console.log("wrong credentials");
                        return throwError(() => err);
                    }
                              
                    authService.logout(true);
                }else  if ([404].includes(err.status)) {
                    // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                    
                    console.error("ERROR 404: ", err);
                    router.navigate(['/404']);
                }

                // const error = err.error.message || err.statusText;
                return throwError(() => err);
            }))


   
    // return next(req);
  }

// @Injectable()
// export class ErrorInterceptor implements HttpInterceptor {
//     constructor(private authService: AuthService) { }

//     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

//         console.log("Error interceptor: " , request);


//         return next.handle(request).pipe(
//             catchError(err => {
//                 console.log("ErrorInterceptor: ", err);
//                 if ([401, 403].includes(err.status)) {
//                     // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
//                     if (err.error.message &&
//                         (err.error.message === 'Incorrect email or password')
//                     ) {
//                         console.log("wrong credentials");
//                         return throwError(() => err);
//                     }
//                     this.authService.logout();
//                 }
//                 // const error = err.error.message || err.statusText;
//                 return throwError(() => err);
//             }))
//     }
// }