import { DecimalPipe, AsyncPipe, CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbHighlight, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../../services/order.service';
import { OrderStatus } from '../../../enums/OrderStatus';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { User } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [DecimalPipe, AsyncPipe, ReactiveFormsModule, NgbHighlight, CommonModule, NgbCollapseModule, FontAwesomeModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit , OnChanges {
  @Input() refresh: any;

  faCircleCheck = faCircleCheck;

  orderList: any[] = [];
  order: any;
  user!: User;
  loading: boolean  = true;

  statusArray: string[] = []; //for search dropdown

  viewOrder: boolean = false;

  constructor(private orderService: OrderService, private authService: AuthService){}
  ngOnChanges(changes: SimpleChanges): void {
    // console.log("On changes: " , this.refresh, changes['refresh']);
    if (changes['refresh'].previousValue){
      this.loading = true;
      this.viewOrder = false;
      this.order = {};
      this.loadOrders("");
    }
  }

  ngOnInit(): void {

    if (this.authService.userValue) {
      this.user = this.authService.userValue;
    }

    const vals = Object.values(OrderStatus);
    vals.forEach(val => {
      this.statusArray.push(val);
    });
    
    // const query = "status=all";
    const query = "";
    this.loadOrders(query);


  }

  
  //droptdown to refresh the quotes for status
  statusSearch($event: any){
    console.log("event: " , $event.target.value);
    const status = $event.target.value;

    if (status !== "all"){
      const query = "status=" + $event.target.value;

      this.loadOrders(query);
    }else{
      this.loadOrders("");
    }
  }

  // updateQuoteStatus(id: string, value: string){

  //   this.loading = true;
  //   const formData = new FormData();
  //   formData.append("quoteId", id);
  //   formData.append("status", value);

  // this.orderService.updateQuote(formData).subscribe({
  //   next: (result) =>{
  //     this.loading = false;
  //     const objIndex = this.quoteList.findIndex(obj => obj.id === id);
  //     this.quoteList[objIndex].status = value;
  //   },
  //   error: (err: any) =>{
  //     this.loading = false;
  //     console.log("updateQuoteStatus error: " , err);
  //   }
  // });

  //   // const query
  //   // loadQuotes
  // }


  loadOrders(query: string){

    this.orderService.loadAllOrders(query).subscribe({
      next: (result) => {
        console.log("Orders result", result);
        this.orderList = result.orders;
        // this.quoteList = result.quotes;

        // for (var i = 0; i < this.quoteList.length; i++){
        //   this.isCollapsed[i] = true;
        // }

        this.loading = false;
      },
      error: (err)=>{
        console.error("listAllQuotes Error: ", err);
        this.loading = false;
      }
    })
  }

  loadSingleOrder(refId: any){
    this.viewOrder = true;
    this.loading = true;
    this.orderService.viewUserOrder(refId).subscribe({
      next: (result) => {
        this.loading = false;
        this.order = result.order;
      },
      error: (err) => {
        console.log("loadSingleOrder Error: " , err);
        this.loading = false;
      }
    });
  }

}
