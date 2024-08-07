import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {


  messageEmitter :EventEmitter<Message> = new EventEmitter<Message>();

  constructor() { }

  sendMessage(message: Message){
    this.messageEmitter.emit(message);
  }
  
}

export interface Message  {
  key: string,
  value: string,
}
