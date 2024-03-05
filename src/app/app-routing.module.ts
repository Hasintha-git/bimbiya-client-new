import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostLoginModule } from './pages/post-login/post-login.module';
import { UserProfileModule } from './pages/pre-login/user-profile/user-profile.module';
import { AuthenticationModule } from './pages/pre-login/authentication/authentication.module';


const routes: Routes = [
  {path:'',redirectTo:'delivery',pathMatch:'full'},
  {
    path: 'delivery',
    loadChildren: () => PostLoginModule,
  },
  {
    path: 'user-profile',
    loadChildren: () => UserProfileModule,
  },{
    path: 'auth',
    loadChildren: () => AuthenticationModule,
  },
  {path: '**', redirectTo: 'delivery'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
