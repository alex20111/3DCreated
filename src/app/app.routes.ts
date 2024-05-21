import { Routes } from '@angular/router';
import { WelcomeComponent } from './views/welcome/welcome.component';
import { ManageProductComponent } from './views/manage-product/manage-product.component';
import { ProductViewComponent } from './views/product-view/product-view.component';
import { categoriesListResolver } from './resolver/categories-resolver';
import { CartComponent } from './views/cart/cart.component';
import { LoginComponent } from './views/login/login.component';
import { SingupComponent } from './views/singup/singup.component';
import { QuoteComponent } from './views/quote/quote.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { ServiceComponent } from './views/service/service.component';

export const routes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'editProduct/:id', component: ManageProductComponent, resolve: {catgList: categoriesListResolver}, },
    { path: 'addProduct', component: ManageProductComponent, resolve: {catgList: categoriesListResolver} },
    { path: 'viewProduct/:id', component: ProductViewComponent },
    { path: 'addToCart/:id', component: CartComponent },
    { path: 'viewCart', component: CartComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SingupComponent },
    { path: 'quote', component: QuoteComponent },
    { path: 'resetPassword', component: ForgotPasswordComponent },
    { path: 'services', component: ServiceComponent },
];
