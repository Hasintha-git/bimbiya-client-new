import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from "ngx-spinner";
import { HttpResponse } from '@angular/common/http';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';
import { LoginService } from 'src/app/services/login/login.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BrowserData } from 'src/app/models/browser';
import { User } from 'src/app/pages/models/user';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { MatDialog } from '@angular/material/dialog';
import { SocialAuthService, SocialUser, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { MobileNumberDialogComponent } from './mobile-number-dialog/mobile-number-dialog.component';
import { GoogleAuthStateService } from 'src/app/services/google-auth-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {

  signInModel = new User();
  userForm: FormGroup;
  public browserData: BrowserData;

  hide = true;
  mobileNoFocused = false;
  passwordFocused = false;
  errorMessage: string;
  warningMessage: string;
  successMessage: string;
  isGoogleLoading = false;
  private googleAuthHandled = false;

  @ViewChild('googleBtn', { static: false }) googleBtn: ElementRef;

  private authSub: Subscription;

  constructor(
    private toastr: ToastServiceService,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar,
    private routerLink: Router,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private sessionStorage: StorageService,
    public authService: AuthService,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private socialAuthService: SocialAuthService,
    private googleAuthState: GoogleAuthStateService
  ) { }

  // Add this helper to your component class
  onGoogleOverlayClick() {
    if (!this.isGoogleLoading) {
      this.isGoogleLoading = true;
      this.googleAuthState.setInitiator('signin');

      // Safety timeout in case the popup is closed without emitting a state
      setTimeout(() => {
        if (this.isGoogleLoading && !this.googleAuthHandled) {
          this.isGoogleLoading = false;
        }
      }, 10000);
    }
  }

  // Ensure your ngOnInit handles the subscription as you already have it:
  ngOnInit(): void {
    this.isAuthenticated();
    this.initialValidator();

    this.authSub = this.socialAuthService.authState.subscribe({
      next: (user) => {
        if (user && !this.googleAuthHandled && this.googleAuthState.getInitiator() === 'signin') {
          this.googleAuthHandled = true;
          this.handleGoogleAuth(user);
          this.googleAuthState.clear();
        } else {
          this.isGoogleLoading = false;
        }
      },
      error: (err) => {
        this.isGoogleLoading = false;
        this.googleAuthHandled = false;
      }
    });
  }

  signInWithGoogle(): void {
    console.log("1. Method triggered"); // Check if this shows

    // Check if the service is actually ready
    if (!this.socialAuthService) {
      console.error("SocialAuthService not initialized");
      return;
    }

    this.isGoogleLoading = true;
    this.googleAuthState.setInitiator('signin');

    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(user => {
        console.log("2. Google User Received:", user);
      })
      .catch(err => {
        console.error("3. Google Sign-in Error:", err);
        this.isGoogleLoading = false;
      });
  }

  initialValidator() {
    this.userForm = this.formBuilder.group({
      mobileNo: this.formBuilder.control('', [
        Validators.required,
        Validators.pattern(/^0\d{9}$/),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]),
      password: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  handleGoogleAuth(user: SocialUser) {
    this.isGoogleLoading = true;
    this.errorMessage = null;

    const payload = {
      email: user.email,
      fullName: user.name,
      googleId: user.id,
      photoUrl: user.photoUrl,
      idToken: user.idToken,
      provider: 'GOOGLE'
    };

    this.loginService.googleAuth(payload).subscribe({
      next: (response: HttpResponse<any>) => {
        this.isGoogleLoading = false;
        if (response.status === 206) {
          this.promptMobileNumber(response.body, user);
          return;
        }
        this.completeGoogleLogin(response);
      },
      error: (err) => {
        this.isGoogleLoading = false;
        this.googleAuthHandled = false;
        this.errorMessage = err.error?.errorDescription || 'Google sign-in failed';
      }
    });
  }


  promptMobileNumber(partialData: any, socialUser: SocialUser): void {
    this.dialog.open(MobileNumberDialogComponent, {
      panelClass: 'mobile-number-dialog-panel',
      backdropClass: 'mobile-number-backdrop',
      width: '380px',
      maxWidth: '95vw',
      disableClose: true,
      data: {
        email: partialData.email,
        fullName: partialData.fullName,
        // ✅ Pre-populate error if backend already flagged the mobile as duplicate
        initialError: partialData.mobileError || null,

        onConfirm: (mobileNo: string, done: (error?: string) => void) => {
          const payload = {
            email: partialData.email,
            fullName: socialUser.name,
            googleId: partialData.googleId,
            idToken: socialUser.idToken,
            provider: 'GOOGLE',
            mobileNo: mobileNo
          };

          this.loginService.googleAuth(payload).subscribe({
            next: (response: HttpResponse<any>) => {
              if (response.status === 206 && response.body?.mobileError) {
                // ✅ Mobile duplicate — stay in dialog, show error
                done(response.body.mobileError);
                return;
              }
              done();
              this.completeGoogleLogin(response);
            },
            error: (err) => {
              done(err.error?.errorDescription || 'Failed. Please try again.');
            }
          });
        }
      }
    });
  }


  private completeGoogleLogin(response: HttpResponse<any>): void {
    const token = response.headers.get('token');
    const refreshToken = response.headers.get('refresh_token');

    console.log('token:', token);           // ✅ is this null?
    console.log('refreshToken:', refreshToken); // ✅ is this null?
    console.log('body:', response.body);

    this.sessionStorage.setSession(token);
    this.sessionStorage.setRefreshToken(refreshToken);
    this.sessionStorage.setUser(response.body['user'].mobileNo);
    this.sessionStorage.setFullName(response.body['user'].fullName);
    this.authService.logIn();
  }

  onSubmit() {
    this.errorMessage = null;
    if (this.userForm.valid) {
      this.spinner.show();
      const loginData = this.userForm.value;
      this.loginService.login(loginData).subscribe(
        (response) => { this.handleSuccess(response); },
        (error) => {
          this.spinner.hide();
          this.errorMessage = error.error?.message || 'Invalid Mobile No or Password';
          this.toastr.errorMessage(this.errorMessage);
        }
      );
    } else {
      this.mandatoryValidation(this.userForm);
    }
  }

  private handleSuccess(response: HttpResponse<any>): void {
    this.sessionStorage.setSession(response.headers.get('token'));
    this.sessionStorage.setRefreshToken(response.headers.get('refresh_token'));
    this.sessionStorage.setUser(response.body['user'].mobileNo);
    this.sessionStorage.setFullName(response.body['user'].fullName);
    this.spinner.hide();
    this.authService.logIn();
  }

  isAuthenticated(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.logIn();
    }
  }

  mandatoryValidation(formGroup: FormGroup) {
    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        const control: FormControl = <FormControl>formGroup.controls[key];
        if (Object.keys(control).includes('controls')) {
          this.mandatoryValidation(<FormGroup>formGroup.controls[key]);
        }
        control.markAsTouched();
      }
    }
  }

  signUp() { this.routerLink.navigateByUrl('/auth/signup'); }

  forgetPassword() {
    const dialogRef = this.dialog.open(ForgetPasswordComponent, {
      data: 12, width: '500px', height: '300px'
    });
    dialogRef.afterClosed().subscribe(() => { });
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;
    if (!pattern.test(String.fromCharCode(event.charCode))) event.preventDefault();
  }

  get mobileNo() { return this.userForm.get('mobileNo'); }
  get password() { return this.userForm.get('password'); }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();  // ✅ clean up on route change
  }
}