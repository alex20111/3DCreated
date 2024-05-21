import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.css'
})
export class ProductViewComponent implements OnInit {

  product: any;
  productMainImage: string ="";

  user: User | undefined = undefined

  constructor(private route: ActivatedRoute, private productService: ProductService, private authService: AuthService) { }

  ngOnInit(): void {

    const paramId = this.route.snapshot.paramMap.get('id');
    console.log("product id: ", paramId);
    if (paramId) {
      this.productService.displayProduct(paramId).subscribe({
        next: (result) => {
          console.log(result);
          this.product = result.product;
          this.productMainImage = `http://localhost:3000/${this.product.coverImageUrl}`;

          this.authService.user.subscribe({
            next: (user) => {
              if (user){
                this.user = user;
              }else{
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

  changeMainImage(url: string){
    this.productMainImage = `http://localhost:3000/${url}`;
  }

  
}
