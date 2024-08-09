import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { QuoteService } from '../../../services/quote.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-quote-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quote-search.component.html',
  styleUrl: './quote-search.component.css'
})
export class QuoteSearchComponent {

  searchSubmitted: boolean = false;
  searchDone: boolean = false;
  quoteNumber: string = "";

  quoteResult: any;

  user: User | undefined;

constructor(private quoteService: QuoteService, private authService: AuthService){}

  searchQuote(event: any){
    console.log("event : " , event.value);
    console.log("quu: " , this.quoteNumber);
    this.searchSubmitted = true;
    this.searchDone = false;

    this.quoteService.getQuoteByReferenceId(this.quoteNumber).subscribe({
      next: (result) => {
        console.log("resukt refernce by id!! " , result)
        if (result.quote){
          this.quoteResult = result.quote;
        }
        this.searchSubmitted = false;
        this.searchDone = true;
        if (this.authService.userValue){
          this.user = this.authService.userValue;
        }
        
      },
      error: (err) => {
        console.log("error: ", err);
        this.quoteResult = undefined;
        this.searchSubmitted = false;
        this.searchDone = true;
      }
    })
  }

}
