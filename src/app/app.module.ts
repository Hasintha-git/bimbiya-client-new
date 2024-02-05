import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import { PostLoginComponent } from './pages/post-login/post-login.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { ToastrModule } from 'ngx-toastr';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatSelectModule } from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import { StorageService } from './services/storage/storage.service';
import { Interceptor } from './services/intercept/intercept.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
const INTERCEPTORS = [{
  provide: HTTP_INTERCEPTORS,
  useClass: Interceptor,
  multi: true
},
  {
    provide: LocationStrategy, useClass: HashLocationStrategy
  }
];
@NgModule({
  declarations: [
    AppComponent,
    PostLoginComponent,
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
    ToastrModule.forRoot({
      timeOut: 5000, // 5 seconds
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true
    }),
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:Interceptor, multi:true},
    StorageService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
