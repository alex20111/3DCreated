import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {  provideHttpClient, withInterceptors } from '@angular/common/http';
import {  loggingInterceptor } from './_helpers/jwt.interceptor';
import { errorInterceptor } from './_helpers/error.interceptor';
import { languageInterceptor } from './_helpers/lang.interceptor';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(    withInterceptors([loggingInterceptor, errorInterceptor, languageInterceptor]) ), provideHttpClient(), 
    provideTransloco({
        config: { 
          availableLangs: ['en', 'fr'],
          defaultLang: 'en',
          // Remove this option if your application doesn't support changing language in runtime.
          reRenderOnLangChange: true,
          prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader
      })    
    // provideNgxStripe('pk_test_51PoVgpDZI5aKursCHegxAnFU6baCikctbnVTOCJjNv4rBarT5NUyWSIkt4kFxw0dOxYVGowd2m9AQgGqx6rwUxdX00hlotvfVF')



    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
};
 