import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostLoginRoutingModule } from './post-login-routing.module';
import { HomeComponent } from './home/home.component';
import { BannerComponent } from './component/banner/banner.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { FoodsComponent } from './foods/foods.component';
import { CategoryComponent } from './component/category/category.component';
import { ProductSectionComponent } from './product-section/product-section.component';
import { ProductSliderComponent } from './component/product-slider/product-slider.component';
import { FooterComponent } from './component/footer/footer.component';
import { BevoguesComponent } from './component/bevogues/bevogues.component';
import { CartDetailComponent } from './component/cart-detail/cart-detail.component';
import { ProductPurchaseComponent } from './component/product-purchase/product-purchase.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { ProductFilterComponent } from './component/product-filter/product-filter.component';
import {MatSliderModule} from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { ProductComponent } from './component/product/product.component';
import {MatPaginatorModule} from '@angular/material/paginator';
@NgModule({
  declarations: [
    HomeComponent,
    BannerComponent,
    NavbarComponent,
    FoodsComponent,
    CategoryComponent,
    ProductSectionComponent,
    ProductSliderComponent,
    FooterComponent,
    BevoguesComponent,
    CartDetailComponent,
    ProductPurchaseComponent,
    CheckoutComponent,
    ProductFilterComponent,
    ProductComponent,
    
  ],
  imports: [
    CommonModule,
    PostLoginRoutingModule,
    MatSliderModule,
    FormsModule,
    MatPaginatorModule
  ]
})
export class PostLoginModule { }
