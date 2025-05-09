import { Component, OnDestroy, OnInit, } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../../services/product.service';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { Message, MessagesService } from '../../services/messages.service';
import { Subscription } from 'rxjs';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule , TranslocoService , TranslocoDirective} from '@jsverse/transloco';
import { LanguageService } from '../../services/language.service';
import { Language } from '../../models/lang';

//transloclDirectives

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterOutlet, RouterModule, FormsModule, NgbPaginationModule,  TranslocoModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit, OnDestroy {
  // <i class="fa-solid fa-magnifying-glass"></i>

  faMagnifyingGlass = faMagnifyingGlass;
  faCircleXmark = faCircleXmark;
  loading: boolean = true;
  productList: any = [];
  categories: category[] = [];
  totalProduct: any = 0;
  paginationTotal: any = 0;

  searchText: string = '';
  searchDisplay: string = '';

  message: string = "";
  messageWarn: string = "";

  msgServiceSubs: Subscription | undefined;
  authServiceSubs: Subscription | undefined;

  user: User | undefined = undefined;

  //search params
  priceMin: any = 1;
  priceMax: any = 1000;
  currentCatgSel: any = 0;
  pageSize: any = 2;
  pageNbr = 1;

  constructor(private productService: ProductService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private msgService: MessagesService,
    private translocoService: TranslocoService,
  private langService: LanguageService) {

     }
  ngOnDestroy(): void {
    if (this.msgServiceSubs) {
      this.msgServiceSubs.unsubscribe();
    }

    if (this.authServiceSubs) {
      this.authServiceSubs.unsubscribe();
    }
  }
  ngOnInit(): void {

   
    const userActivated = this.route.snapshot.queryParamMap.get('userActivated') !== null ? this.route.snapshot.queryParamMap.get('userActivated') as string : undefined;

    // console.log("userActivated: ", userActivated);

    if (userActivated !== undefined) {
      if (userActivated === 'true') {
        this.translocoService.selectTranslate('welcome.ts.acctActivated')
        .subscribe(value => {this.message = value} );
        // this.message =  this.translocoService.translate('welcome.ts.acctActivated');
        // $localize`:@@welcomeTs-acctActivated:Account activated.`;
      } else {
        this.translocoService.selectTranslate('welcome.ts.acctActivatedErr')
        .subscribe(value => {this.message = value} );
        // this.message = this.translocoService.translate('welcome.ts.acctActivatedErr');
        //  $localize`:@@welcomeTs-acctActivatedErr:Account activation error.`;
      }
    }

    this.loading = true;

    this.authServiceSubs = this.authService.user.subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
        } else {
          this.user = undefined;
        }
      }
    });
    this.loadProducts("categoriesList=true");

    this.msgServiceSubs = this.msgService.getData().subscribe({
      next: (msg: Message) => {
        console.log("Message service recieved : ", msg);
        if (msg.key === "session" && msg.value === "expired") {
          this.translocoService.selectTranslate('welcome.ts.session_exp')
                         .subscribe(value => {this.messageWarn = value} );
          // this.messageWarn =  this.translocoService.translate('welcome.ts.session_exp');
          // $localize`:@@welcomeTs.session_exp:Your sesson has expired`;
          // this.messageWarn = "Your session has expired";
          this.msgService.removeItem();
        }
      }
    });
  }

  //select categories
  loadSelected(id: any, tot: any) {
    // console.log("load selected product: ", id);

    if (!this.loading) {
      this.paginationTotal = tot ;
      this.pageNbr = 1;
      // this.active = id;
      this.searchDisplay = "";
      this.searchText = "";
      this.productList = [];
      this.currentCatgSel = id;

      this.loading = true;
      this.loadProducts(undefined);    
    }
  }

  priceChange() {

    this.loading = true;
    // console.log(evnt);
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
    this.loadProducts(undefined);

  }
  search() {
    this.currentCatgSel = -1;
    this.loading = true;
    this.pageNbr = 1;
    this.searchDisplay = this.searchText;
    const query = 'searchKeyword=' + this.searchDisplay;

    this.loadProducts(query);
  }
  resetSearch() {
    this.loading = true;
    this.searchDisplay = "";
    this.searchText = "";
    this.loadProducts(undefined);
  }

  addCart() {
    console.log("add cart");
  }



  private loadProducts(param: any) {

    let query = "";
    if (param) {
      query =  param;
      query = query + '&pageSize=' + this.pageSize + '&pageNbr=' + (this.pageNbr - 1);
      // query = query + 
    } else {

      query = 'category=' + this.currentCatgSel;
      query = query + '&pageSize=' + this.pageSize;
      query = query + '&pageNbr=' + (this.pageNbr - 1);
      //build query

      if (this.priceMin) {
        query = query + '&priceMin=' + this.priceMin;
      }
      if (this.priceMax) {
        query = query + '&priceMax=' + this.priceMax;
      }
    }
    // console.log("QUery: ", query);


    this.productService.listProduct(query).subscribe({
      next: (result) => {
        // console.log(result);
        this.loading = false;
        this.productList = result.products;

        if (result.catgNbr) {
          this.paginationTotal = result.catgNbr.totalCount;
          this.categories = result.catgNbr.catgList;
          this.totalProduct = result.catgNbr.totalCount;     
        }
        if (result.textSearchCount){
          this.paginationTotal = result.textSearchCount;
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    }
    );
  }
  //drop down filter to change the number of items per page
  filterSizeChange(event: any) {
    this.loading = true;
    // console.log("event: " , event.target.value);
    this.pageSize = event.target.value;
    this.loadProducts(undefined);
  }

  paginationChange(number: any) {
    // console.log("this page ", number);
    this.pageNbr = number;
    if (this.searchDisplay  && this.searchDisplay.length > 0){
      this.loadProducts('searchKeyword=' + this.searchDisplay);
    }else{
      this.loadProducts(undefined);
    }
    
  }

  // test(){
  //   const scr  = document.getElementById("thisIdIsMine");
  //   console.log("Exist: ", scr);

  //   if (!scr){
  //     let node = document.createElement('script');
  //     node.src = "https://www.google.com/recaptcha/api.js?render=6LeVQjEqAAAAAAk194docf99x3LPs3YGGBHCMSIN";//Change to your js file
  //     node.type = 'text/javascript';
  //     node.async = true;
  //     node.id = "thisIdIsMine";
  //     // node.charset = 'utf-8';
  //     document.getElementsByTagName('head')[0].appendChild(node);
  //   }
  // }
  // remove(){
  //   // const scr  = document.getElementById("thisIdIsMine");
  //   // scr?.remove();
  //   (window as any)['ngRecaptcha3Loaded'] = () => {
  //     console.log("loaddedededed");
  //   };
  //   console.log("GOGOGOOG");
  //   // grecaptcha().ready(function() {
  //     (window as any)['grecaptcha'].execute('6LeVQjEqAAAAAAk194docf99x3LPs3YGGBHCMSIN', {action: 'submit'}).then((token:any ) => {
  //         // Add your logic to submit to your backend server here.
  //         console.log("Token: " , token);
  //         // this.message = token;

  //     }).catch( (err: any)     => {
  //       console.log("errrrorororororoo: " , err)
  //     });
  //   // });

  // }

  setNag(){
    // const val = this.translocoService.translate('quote.ts.quoteSent', { email: `bbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaa` , ro: " aall d"});
    const val2 = this.translocoService.translate('welcome.ts.session_exp');
    console.log("Transalted value: " ,  val2);
    this.translocoService.selectTranslate('welcome.ts.session_exp')
    .subscribe(value => { console.log("trans") ; this.messageWarn = value} );
    // this.translocoService.setActiveLang('fr');
    // const langCode: Language = {
    //   locale: "fr"
    // }
    // this.langService.savelang(langCode);

  }
}

export interface category {
  id: number,
  name: string,
  prodQuantity: number
}
