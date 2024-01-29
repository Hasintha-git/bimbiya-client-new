import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostLoginModule } from './pages/post-login/post-login.module';
import { UserProfileModule } from './pages/pre-login/user-profile/user-profile.module';
import { AuthenticationModule } from './pages/pre-login/authentication/authentication.module';


const routes: Routes = [
  {path:'',redirectTo:'post-login',pathMatch:'full'},
  {
    path: 'post-login',
    loadChildren: () => PostLoginModule,
  },
  {
    path: 'user-profile',
    loadChildren: () => UserProfileModule,
  },{
    path: 'auth',
    loadChildren: () => AuthenticationModule,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
