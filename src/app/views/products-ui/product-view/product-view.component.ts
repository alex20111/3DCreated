import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';
import { environment } from '../../../../environments/environment';
import { TranslocoModule } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule, FormsModule],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.css'
})
export class ProductViewComponent implements OnInit {

  product: any;
  productMainImage: string = "";
  hostPort: string = environment.HOST_PORT;
  quantity: string = "1";
  quantityError: string = "";

  user: User | undefined = undefined

  constructor(private route: ActivatedRoute, private productService: ProductService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    const paramId = this.route.snapshot.paramMap.get('id');
    // console.log("product id: ", paramId);
    if (paramId) {
      this.productService.displayProduct(paramId).subscribe({
        next: (result) => {
          console.log(result);
          this.product = result.product;
          this.productMainImage = `${environment.HOST_PORT}/${this.product.coverImageUrl}`;

          this.authService.user.subscribe({
            next: (user) => {
              if (user) {
                this.user = user;
              } else {
                this.user = undefined;
              }
            }
          });


        },
        error: (err) => {
          console.error(err);
        }
      }
      );
    }


  }

  changeMainImage(url: string) {
    this.productMainImage = `${environment.HOST_PORT}/${url}`;
  }

  addtoCart() {
    // [routerLink]="['/addToCart',product.id] " 

    console.log("Number.isNaN(this.quantity): " , Number.isNaN(this.quantity) , isNaN(parseInt(this.quantity)));
    this.quantityError = "";
    if (!isNaN(parseInt(this.quantity)))  {
      this.router.navigate(
        ['/addToCart'],
        { queryParams: { productId: this.product.id, productQty: parseInt(this.quantity) } }
      );
    } else {
      console.log("Not a number");
      this.quantityError = "Please enter a valid quantity";
    }
  }


}
