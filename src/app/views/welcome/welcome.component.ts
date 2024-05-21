import { Component, OnInit, } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterOutlet, RouterModule, FormsModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit {
  // <i class="fa-solid fa-magnifying-glass"></i>

  faMagnifyingGlass = faMagnifyingGlass;
  faCircleXmark = faCircleXmark;
  loading: boolean = true;
  productList: any = [];
  categories: category[] = [];
  totalProduct: number = 0;

  searchText: string = '';
  searchDisplay: string = '';
  priceMin: any = 5;
  priceMax: any = 100;

  user: User | undefined = undefined;

  constructor(private productService: ProductService, private authService: AuthService) { }
  ngOnInit(): void {
    this.loading = true;

    this.authService.user.subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
        } else {
          this.user = undefined;
        }
      }
    });
    this.totalProduct = 0;
    this.loadProducts("categoriesList=true");
  }

  loadSelected(id: any, evnt: any) {
    console.log("load selected product: ", id);
    this.searchDisplay = "";
    this.searchText = "";
    this.productList = [];


    if (id === 0) {
      console.log("Load ALLL");
      this.loadProducts(undefined);
    }
    else {
      let query = "category=" + id;
      this.loadProducts(query);
    }
  }

  priceChange(evnt: any) {
    console.log(evnt);
    const min = parseInt(this.priceMin);
    const max = parseInt(this.priceMax);

    if (Number.isNaN(min)) {
      this.priceMin = 0;
      return;
    }
    if (Number.isNaN(max)) {
      this.priceMax = +this.priceMin + 1;
      return;
    }
    if (max <= min) {
      this.priceMax = +this.priceMin + 1;

    }
let query: string = '';

    if (this.searchDisplay){
      query = 'searchKeyword=' + this.searchDisplay + "&";
    }

     query = query + 'priceMin=' + this.priceMin + '&priceMax=' + this.priceMax;
    this.loadProducts(query);

  }
  search() {

    this.searchDisplay = this.searchText;
    const query = 'searchKeyword=' + this.searchDisplay;

    this.loadProducts(query);

  }
  resetSearch() {
    this.searchDisplay = "";
    this.searchText = "";

    this.loadProducts(undefined);

  }

  addCart() {
    console.log("add cart");
  }

  private loadProducts(query: any) {

    this.productService.listProduct(query).subscribe({
      next: (result) => {
        console.log(result);
        this.loading = false;
        this.productList = result.products;

        if (result.categories) {
          result.categories.forEach((c: any) => {
            let nbr = 0;
            result.products.forEach((p: any) => {
              if (c.id === p.categoryId) {
                nbr++;
              }
            });
            this.categories.push({
              id: c.id,
              name: c.category,
              prodQuantity: nbr
            });
            this.totalProduct = this.totalProduct + nbr;
          });
        }


      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    }
    );
  }
}

export interface category {
  id: number,
  name: string,
  prodQuantity: number
}
