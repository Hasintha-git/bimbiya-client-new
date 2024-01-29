import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthenticationComponent } from './authentication.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

const routes: Routes = [
  {path:'',component:AuthenticationComponent, children:[
    {path:'',redirectTo:'signin',pathMatch:'full'},
    {path:'signin',component:SignInComponent},
    {path:'signup',component:SignUpComponent},
    {path:'forget-password',component:ForgetPasswordComponent},
  ]},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
