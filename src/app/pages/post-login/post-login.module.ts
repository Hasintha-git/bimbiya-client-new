import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostLoginRoutingModule } from './post-login-routing.module';
import { HomeComponent } from './home/home.component';
import { BannerComponent } from './component/banner/banner.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { FoodsComponent } from './foods/foods.component';


@NgModule({
  declarations: [
    HomeComponent,
    BannerComponent,
    NavbarComponent,
    FoodsComponent
  ],
  imports: [
    CommonModule,
    PostLoginRoutingModule
  ]
})
export class PostLoginModule { }
