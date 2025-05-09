import { inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LanguageService } from '../services/language.service';

// import { environment } from '@environments/environment';





export function languageInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    // console.log("loggingInterceptor");
    const langService = inject(LanguageService);


    // console.log("user token: " , isLoggedIn);
    let langCode = "en";

    const language = langService.languageValue;

    if (language) {
        langCode = language.locale;
    }

    req = req.clone({
        setHeaders: {
            'accept-language': langCode
        }
    });

    // req.clone({
    //     headers: req.headers.append(
    //         "Accept-Language", "this.injector.get(TranslateService).currentLang" )
    //  } );
    // }
    return next(req);
}


