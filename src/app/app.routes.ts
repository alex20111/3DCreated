import { Routes } from '@angular/router';
import { WelcomeComponent } from './views/welcome/welcome.component';
import { ManageProductComponent } from './views/products-ui/manage-product/manage-product.component';
import { ProductViewComponent } from './views/products-ui/product-view/product-view.component';
import { categoriesListResolver } from './resolver/categories-resolver';
import { CartComponent } from './views/cart/cart.component';
import { QuoteComponent } from './views/quote/quote.component';
import { ServiceComponent } from './views/service/service.component';
import { LoginComponent } from './views/auth-view/login/login.component';
import { SingupComponent } from './views/auth-view/singup/singup.component';
import { ChangePasswordComponent } from './views/auth-view/change-password/change-password.component';
import { ForgotPasswordComponent } from './views/auth-view/forgot-password/forgot-password.component';
import { AuthGuard } from './_helpers/auth.guard';
import { MyProfileComponent } from './views/my-account/my-profile/my-profile.component';
import { MyInfoComponent } from './views/my-account/my-info/my-info.component';
import { QuoteListComponent } from './views/my-account/quote-list/quote-list.component';
import { ContactUsComponent } from './views/contact-us/contact-us.component';
import { AdminAuthGuard } from './_helpers/adminAuth.guard';
import { CartReceiptComponent } from './views/cart/cart-receipt/cart-receipt.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';


export const routes: Routes = [
     
    { path: '', component: WelcomeComponent },
    { path: 'editProduct/:id', component: ManageProductComponent, resolve: {catgList: categoriesListResolver},canActivate : [AdminAuthGuard] },
    { path: 'addProduct', component: ManageProductComponent, resolve: {catgList: categoriesListResolver} ,canActivate : [AdminAuthGuard]},
    { path: 'viewProduct/:id', component: ProductViewComponent },
    { path: 'addToCart', component: CartComponent },
    { path: 'viewCart', component: CartComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SingupComponent },
    { path: 'quote', component: QuoteComponent },
    { path: 'resetPassword', component: ForgotPasswordComponent },
    { path: 'services', component: ServiceComponent },
    { path: 'changePassword', component: ChangePasswordComponent },
    { path: 'contactUs', component: ContactUsComponent },
    { path: 'receipt', component: CartReceiptComponent ,canActivate : [AuthGuard]},
    // { path: 'myProfile', component: MyProfileComponent ,canActivate : [AuthGuard]},
     {path: 'myProfile', canActivate: [AuthGuard], children: [
        {path: 'home', component: MyProfileComponent},
        {path: 'myInformation', component: MyInfoComponent},
        {path: 'quoteList', component: QuoteListComponent},
        {path: 'info', component: MyInfoComponent}
      ]
    },
    {path: '404', component: PageNotFoundComponent},
    {path: '**', redirectTo: '/404'}


];
