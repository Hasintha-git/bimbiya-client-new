import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PostLoginComponent } from './post-login.component';
import { FoodsComponent } from './foods/foods.component';
import { ProductPurchaseComponent } from './component/product-purchase/product-purchase.component';
import { ProductFilterComponent } from './component/product-filter/product-filter.component';

const routes: Routes = [
  {path:'',component:PostLoginComponent, children:[
    {path:'',redirectTo:'home',pathMatch:'full'},
    {path:'home',component:HomeComponent},
    {path:'product',component:ProductFilterComponent}
  ]},

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostLoginRoutingModule { }
