import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostLoginRoutingModule } from './post-login-routing.module';
import { HomeComponent } from './home/home.component';
import { BannerComponent } from './component/banner/banner.component';
import { CategoryComponent } from './component/category/category.component';
import { ProductSectionComponent } from './product-section/product-section.component';
import { ProductSliderComponent } from './component/product-slider/product-slider.component';
import { FooterComponent } from './component/footer/footer.component';
import { BevoguesComponent } from './component/bevogues/bevogues.component';
import { CartDetailComponent } from './component/cart-detail/cart-detail.component';
import { ProductPurchaseComponent } from './component/product-purchase/product-purchase.component';
import { ProductFilterComponent } from './component/product-filter/product-filter.component';
import {MatSliderModule} from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './component/product/product.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ScheduleOrderComponent } from './component/schedule-order/schedule-order.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SubBannerComponent } from './component/sub-banner/sub-banner.component';
import { PrivacyPolicyComponent } from './component/footer/privacy-policy/privacy-policy.component';
import { TermConditionComponent } from './component/footer/term-condition/term-condition.component';
import { ReturnPolicyComponent } from './component/footer/return-policy/return-policy.component';
import { FaqComponent } from './component/footer/faq/faq.component';
import { ContactUsComponent } from './component/footer/contact-us/contact-us.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  declarations: [
    HomeComponent,
    BannerComponent,
    CategoryComponent,
    ProductSectionComponent,
    ProductSliderComponent,
    FooterComponent,
    BevoguesComponent,
    CartDetailComponent,
    ProductPurchaseComponent,
    ProductFilterComponent,
    ProductComponent,
    ScheduleOrderComponent,
    SubBannerComponent,
    PrivacyPolicyComponent,
    TermConditionComponent,
    ReturnPolicyComponent,
    FaqComponent,
    ContactUsComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    PostLoginRoutingModule,
    MatSliderModule,
    FormsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatAutocompleteModule,
    NgxMaterialTimepickerModule
  ]
})
export class PostLoginModule { }
