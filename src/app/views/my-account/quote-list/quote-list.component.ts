import { Component, OnInit, PipeTransform } from '@angular/core';
import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgbCollapseModule, NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { QuoteService } from '../../../services/quote.service';
import { BrowserModule } from '@angular/platform-browser';
import { QuoteStatus } from '../../../enums/QuoteStatus';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-quote-list',
  standalone: true,
  imports: [DecimalPipe, AsyncPipe, ReactiveFormsModule, NgbHighlight, CommonModule, NgbCollapseModule, TranslocoModule],
  templateUrl: './quote-list.component.html',
  styleUrl: './quote-list.component.css'
})
export class QuoteListComponent implements OnInit {

  quoteList: any[] = [];
  loading: boolean  = true;

  isCollapsed: boolean[] = [];
  statusArray: string[] = []; //for search dropdown


  constructor(private quoteService: QuoteService){}
  ngOnInit(): void {

    // const keys = Object.keys(QuoteStatus);
    // keys.forEach(key => {
    //   console.log("key: " , key);
    // });

    const vals = Object.values(QuoteStatus);
    vals.forEach(val => {
      this.statusArray.push(val);
    });
    
    // const query = "status=all";
    const query = "";
    this.loadQuotes(query);
  }

  //method to download STL file from server.
  stlFile(file: string){
    this.quoteService.downloadSTLFile(file)
    
    .subscribe({
      next: (result) =>{
        console.log(result);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(result);
        link.download = file;
      link.click();
    link.remove();
      },
      error: (err)=>{
        console.log(err);
      }
    });
  }

  //droptdown to refresh the quotes for status
  statusSearch($event: any){
    console.log("event: " , $event.target.value);

    const status = $event.target.value;

    if (status !== "all"){
      const query = "status=" + $event.target.value;

      this.loadQuotes(query);
    }else{
      this.loadQuotes("");
    }
  }

  updateQuoteStatus(id: string, value: string){

    this.loading = true;
    const formData = new FormData();
    formData.append("quoteId", id);
    formData.append("status", value);

  this.quoteService.updateQuote(formData).subscribe({
    next: (result) =>{
      this.loading = false;
      const objIndex = this.quoteList.findIndex(obj => obj.id === id);
      this.quoteList[objIndex].status = value;
    },
    error: (err) =>{
      this.loading = false;
      console.log("updateQuoteStatus error: " , err);
    }
  });

    // const query
    // loadQuotes
  }


  loadQuotes(query: string){

    this.quoteService.listAllQuotes(query).subscribe({
      next: (result) => {
        console.log("Quotes result", result);
        this.quoteList = result.quotes;

        for (var i = 0; i < this.quoteList.length; i++){
          this.isCollapsed[i] = true;
        }

        this.loading = false;
      },
      error: (err)=>{
        console.error("listAllQuotes Error: ", err);
        this.loading = false;
      }
    })
  }

}
