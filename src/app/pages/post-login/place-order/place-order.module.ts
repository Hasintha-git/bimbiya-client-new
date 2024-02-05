import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaceOrderRoutingModule } from './place-order-routing.module';
import { PlaceOrderComponent } from './place-order.component';
import { CheckoutComponent } from './checkout/checkout.component';


@NgModule({
  declarations: [
    PlaceOrderComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    PlaceOrderRoutingModule
  ]
})
export class PlaceOrderModule { }
