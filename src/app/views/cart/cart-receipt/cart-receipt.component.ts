import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-cart-receipt',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './cart-receipt.component.html',
  styleUrl: './cart-receipt.component.css'
})
export class CartReceiptComponent implements OnInit {

  loading: boolean = false;
  // orderRefId: string | undefined;
  user!: User;
  order: any;

  constructor(private route: ActivatedRoute
    , private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
  private cartService: CartService) { }

  ngOnInit(): void {

    const orderRefId = this.route.snapshot.queryParamMap.get('result') !== null ? this.route.snapshot.queryParamMap.get('result') as string : undefined;
    this.loading = true;

  

    console.log("result: ", orderRefId);
    if (this.authService.userValue) {
      this.user = this.authService.userValue;
    }

    if (orderRefId && orderRefId !== "-1") {
      this.orderService.viewUserOrder(orderRefId).subscribe({
        next: (result) => {
          this.order = result.order;
          console.log("result: ", result);
          this.cartService.emptyCart();
          this.loading = false;
        },
        error: (err) => {
          console.log("reciept error: ", err);
          this.cartService.emptyCart();
          this.loading = false;
        }
      });
    } else {
      //no ref id then return to cart.
      console.log("return to view cart!")
      this.router.navigate(['/viewCart']);
    }
  }

}
