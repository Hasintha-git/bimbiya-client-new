import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RegexFormateModule } from 'src/app/utility/directive/regex-formate.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GoogleSigninButtonModule, SocialLoginModule } from '@abacritt/angularx-social-login';
import { MobileNumberDialogComponent } from './sign-in/mobile-number-dialog/mobile-number-dialog.component';

@NgModule({
  declarations: [
    AuthenticationComponent,
    SignInComponent,
    SignUpComponent,
    ForgetPasswordComponent,
    MobileNumberDialogComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    RegexFormateModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    GoogleSigninButtonModule
  ]
  // ← NO providers here
})
export class AuthenticationModule { }