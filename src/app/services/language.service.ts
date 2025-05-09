import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Language } from '../models/lang';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private LangLocalName: string = "language3D";

  private langSubject: BehaviorSubject<Language | null>;
  public lang: Observable<Language | null>;


  constructor() { 
    this.langSubject = new BehaviorSubject(JSON.parse(localStorage.getItem(this.LangLocalName)!));
    this.lang = this.langSubject.asObservable();

    if (this.langSubject.value === null ){
      const lang: Language = {
        locale: "en"
      }
      localStorage.setItem(this.LangLocalName, JSON.stringify(lang));
      this.langSubject.next(lang);
    }

  }

  public get languageValue(){
    return this.langSubject.value;
  }

  savelang(lang: Language){
    localStorage.setItem(this.LangLocalName, JSON.stringify(lang));
    this.langSubject.next(lang);
  }
  setDefaultLang(){
    // localStorage.removeItem(this.LangLocalName);
    // this.langSubject.next(null);
  }



}
