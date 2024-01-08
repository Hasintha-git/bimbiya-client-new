import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './pages/pre-login/sign-in/sign-in.component';
import { SignUpComponent } from './pages/pre-login/sign-up/sign-up.component';
import { PostLoginModule } from './pages/post-login/post-login.module';
import { UserProfileModule } from './pages/pre-login/user-profile/user-profile.module';
import { ForgetPasswordComponent } from './pages/pre-login/forget-password/forget-password.component';


const routes: Routes = [
  {path:'',redirectTo:'post-login',pathMatch:'full'},
  {
    path: 'login',
    component: SignInComponent,
  },
  {
    path: 'register',
    component: SignUpComponent,
  },
  {
    path: 'post-login',
    loadChildren: () => PostLoginModule,
  },
  {
    path: 'user-profile',
    loadChildren: () => UserProfileModule,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
