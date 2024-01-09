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


@NgModule({
  declarations: [
    HomeComponent,
    BannerComponent,
    NavbarComponent,
    FoodsComponent,
    CategoryComponent,
    ProductSectionComponent,
    ProductSliderComponent
  ],
  imports: [
    CommonModule,
    PostLoginRoutingModule
  ]
})
export class PostLoginModule { }
