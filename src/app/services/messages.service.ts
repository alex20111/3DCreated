import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {


  // messageEmitter :EventEmitter<Message> = new EventEmitter<Message>();
  private dataSubject = new BehaviorSubject<Message>({key: "", value: ""});

  constructor() { }

  sendMessage(message: Message){
    // this.messageEmitter.emit(message);
    this.dataSubject.next(message);
  }

  getData() {
    return this.dataSubject.asObservable();
  }
  removeItem(){
    this.dataSubject.next({key: "", value: ""});
  }
  
}

export interface Message  {
  key: string,
  value: string,
}
