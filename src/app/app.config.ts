import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {  provideHttpClient, withInterceptors } from '@angular/common/http';
import {  loggingInterceptor } from './_helpers/jwt.interceptor';
import { errorInterceptor } from './_helpers/error.interceptor';
import { provideNgxStripe } from 'ngx-stripe';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(    withInterceptors([loggingInterceptor, errorInterceptor]) )    
    // provideNgxStripe('pk_test_51PoVgpDZI5aKursCHegxAnFU6baCikctbnVTOCJjNv4rBarT5NUyWSIkt4kFxw0dOxYVGowd2m9AQgGqx6rwUxdX00hlotvfVF')



    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
};
 