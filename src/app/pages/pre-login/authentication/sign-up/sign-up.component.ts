import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/pages/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoginService } from 'src/app/services/login/login.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  signUpModel = new User();
  hide = true;
  hideConfirm = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: LoginService,
    private toastr: ToastServiceService,
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: AbstractControl) {
    return g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;
    if (!pattern.test(String.fromCharCode(event.charCode))) event.preventDefault();
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
        // ✅ SAME AS LOGIN SUCCESS
        this.storageService.setSession(response.headers.get('token'));
        this.storageService.setRefreshToken(response.headers.get('refresh_token'));

        this.storageService.setUser(response.body.user.mobileNo);
        this.storageService.setFullName(response.body.user.fullName);

        this.toastr.successMessage('Registration successful!');
        this.authService.logIn(); // redirect to dashboard
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.errorMessage(
          err.error?.errorDescription || 'Registration failed'
        );
      }
    });
  } else {
    this.signUpForm.markAllAsTouched();
  }
}


  signIn() { this.router.navigate(['/auth/signin']); }
  get f() { return this.signUpForm.controls; }
}