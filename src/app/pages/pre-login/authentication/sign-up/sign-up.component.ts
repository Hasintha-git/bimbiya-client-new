import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { User } from 'src/app/pages/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoginService } from 'src/app/services/login/login.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { MatDialog } from '@angular/material/dialog';
import { MobileNumberDialogComponent } from '../sign-in/mobile-number-dialog/mobile-number-dialog.component';
import { GoogleAuthStateService } from 'src/app/services/google-auth-state.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {

  signUpForm!: FormGroup;
  signUpModel = new User();
  hide = true;
  hideConfirm = true;
  isLoading = false;
  isGoogleLoading = false;
  errorMessage: string;
  private googleAuthHandled = false;

  fullNameFocused = false;
  emailFocused = false;
  mobileFocused = false;
  passwordFocused = false;
  confirmFocused = false;

  private authSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private userService: LoginService,
    private toastr: ToastServiceService,
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    public dialog: MatDialog,
    private googleAuthState: GoogleAuthStateService
  ) { }

  onGoogleOverlayClick() {
    if (!this.isGoogleLoading) {
      this.isGoogleLoading = true;
      this.googleAuthState.setInitiator('signup');

      // Safety Reset
      setTimeout(() => {
        if (this.isGoogleLoading && !this.googleAuthHandled) {
          this.isGoogleLoading = false;
        }
      }, 10000);
    }
  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
    this.authSub = this.socialAuthService.authState.subscribe({
      next: (user: SocialUser) => {
        if (user && !this.googleAuthHandled && this.googleAuthState.getInitiator() === 'signup') {
          this.googleAuthHandled = true;
          this.googleAuthState.clear();
          this.handleGoogleAuth(user);
        } else if (!user) {
          this.isGoogleLoading = false;
          this.googleAuthHandled = false;
        }
      },
      error: (err) => {
        console.error('Google Auth State Error:', err);
        this.isGoogleLoading = false;
        this.googleAuthHandled = false;
      }
    });
  }

  passwordMatchValidator(g: AbstractControl) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  signUpWithGoogle(): void {
    this.googleAuthState.setInitiator('signup');
    (document.querySelector('#google-signup-btn div[role="button"]') as HTMLElement)?.click();
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

    this.userService.googleAuth(payload).subscribe({
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
        this.googleAuthHandled = false;  // ✅ allow retry on error
        this.toastr.errorMessage(err.error?.errorDescription || 'Google sign-up failed');
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
        initialError: partialData.mobileError || null,  // ✅ pre-populate error if duplicate

        onConfirm: (mobileNo: string, done: (error?: string) => void) => {
          const payload = {
            email: partialData.email,
            fullName: socialUser.name,
            googleId: partialData.googleId,
            idToken: socialUser.idToken,
            provider: 'GOOGLE',
            mobileNo: mobileNo
          };

          this.userService.googleAuth(payload).subscribe({
            next: (response: HttpResponse<any>) => {
              // ✅ 206 with mobileError — stay in dialog, show error
              if (response.status === 206 && response.body?.mobileError) {
                done(response.body.mobileError);
                return;
              }
              done();                           // ✅ success — close dialog
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
    this.storageService.setSession(response.headers.get('token'));
    this.storageService.setRefreshToken(response.headers.get('refresh_token'));
    this.storageService.setUser(response.body['user'].mobileNo);
    this.storageService.setFullName(response.body['user'].fullName || '');
    this.authService.logIn();
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      this.isLoading = true;
      const val = this.signUpForm.value;

      this.signUpModel.fullName = val.fullName;
      this.signUpModel.email = val.email;
      this.signUpModel.mobileNo = val.mobile;
      this.signUpModel.password = val.password;
      this.signUpModel.status = 'active';
      this.signUpModel.userRole = 'client';

      this.userService.add(this.signUpModel).subscribe({
        next: (response) => {
          this.storageService.setSession(response.headers.get('token'));
          this.storageService.setRefreshToken(response.headers.get('refresh_token'));
          this.storageService.setUser(response.body.user.mobileNo);
          this.storageService.setFullName(response.body.user.fullName);
          this.authService.logIn();
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.errorMessage(err.error?.errorDescription || 'Registration failed');
        }
      });
    } else {
      this.signUpForm.markAllAsTouched();
    }
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;
    if (!pattern.test(String.fromCharCode(event.charCode))) event.preventDefault();
  }

  signIn() { this.router.navigate(['/auth/signin']); }
  get f() { return this.signUpForm.controls; }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();  // ✅ clean up on route change
  }
}