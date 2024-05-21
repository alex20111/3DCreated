import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { ProductService } from "../services/product.service";
import { inject } from "@angular/core";

export const categoriesListResolver: ResolveFn<any> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(ProductService).getCategoryList();
    };