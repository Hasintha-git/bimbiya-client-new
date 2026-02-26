import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PostLoginComponent } from './post-login.component';
import { ProductFilterComponent } from './component/product-filter/product-filter.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PrivacyPolicyComponent } from './component/footer/privacy-policy/privacy-policy.component';
import { ReturnPolicyComponent } from './component/footer/return-policy/return-policy.component';
import { TermConditionComponent } from './component/footer/term-condition/term-condition.component';
import { ContactUsComponent } from './component/footer/contact-us/contact-us.component';
import { FaqComponent } from './component/footer/faq/faq.component';
import { AuthGuard } from 'src/app/utility/authguard/auth.guard';
import { AboutComponent } from './component/footer/about/about.component';
import { AccountSettingsComponent } from '../template/account-settings/account-settings.component';
import { ActiveOrdersComponent } from '../template/active-orders/active-orders.component';
import { OrderTrackingComponent } from '../template/order-tracking/order-tracking.component';

const routes: Routes = [
  {path:'',component:PostLoginComponent, children:[
    {path:'',redirectTo:'home',pathMatch:'full'},
    {path:'home',component:HomeComponent},
    {path:'product',component:ProductFilterComponent},
    { 
      path: 'place-order', 
      component: CheckoutComponent, 
      canActivate: [AuthGuard], 
      runGuardsAndResolvers: 'always' 
    },
    {path:'privacy-policy',component:PrivacyPolicyComponent},
    {path:'return-policy',component:ReturnPolicyComponent},
    {path:'term-and-condition',component:TermConditionComponent},
    {path:'faq',component:FaqComponent},
    {path:'contact-us',component:ContactUsComponent},
    {path:'about',component:AboutComponent},
    {path: '**', redirectTo: 'delivery'},
      { 
  path: 'account-settings', 
  component: AccountSettingsComponent 
},
{
  path: 'order-tracking',
  component: ActiveOrdersComponent
},
{
  path: 'order-details/:id',
  component: OrderTrackingComponent
}
  ]},
  // {
  //   path: 'place-order',
  //   loadChildren: () => PlaceOrderModule,
  // },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostLoginRoutingModule { }
