import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { PostLoginComponent } from './pages/post-login/post-login.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from './services/storage/storage.service';
import { Interceptor } from './services/intercept/intercept.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NavbarComponent } from './pages/template/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { HeadlineComponent } from './pages/template/headline/headline.component';
import { ProfileSidebarComponent } from './pages/template/profile-sidebar/profile-sidebar.component';
import { AccountSettingsComponent } from './pages/template/account-settings/account-settings.component';
import { ActiveOrdersComponent } from './pages/template/active-orders/active-orders.component';
import { OrderTrackingComponent } from './pages/template/order-tracking/order-tracking.component';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule,
  GoogleSigninButtonModule,
  SOCIAL_AUTH_CONFIG
} from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    PostLoginComponent,
    NavbarComponent,
    HeadlineComponent,
    ProfileSidebarComponent,
    AccountSettingsComponent,
    ActiveOrdersComponent,
    OrderTrackingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    MatSelectModule,
    MatIconModule,
    RouterModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true
    }),
    SocialLoginModule,
    GoogleSigninButtonModule,
  ],
 providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    StorageService,
    {
      provide: SOCIAL_AUTH_CONFIG,   // ✅ use the InjectionToken, not the string
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId, {
          oneTapEnabled: false, // Set to false if using custom buttons
          strict_discovery_document: false 
        })
          }
        ],
        onError: (err) => console.error('SocialAuth Error:', err)
      } as SocialAuthServiceConfig
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }