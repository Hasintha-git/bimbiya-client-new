import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { NgxSpinnerService } from "ngx-spinner";
import { CODE_REQUEST_INVALID_USERSESSION, CODE_REQUEST_TIMEOUT, CODE_REQUEST_UNAUTHORIZED, GATEWAY_TIMEOUT_ERROR_CODE, GLOBAL_SUCCESS_MESSAGE_PASSWORD_CHANGE, INTERNAL_SERVER_ERROR_CODE, NOT_FOUND_ERROR_CODE, PASSWORD_WRONG, UNABLE_TO_SERVE_REQUEST_DES, UNAUTH_ERROR_CODE, MOBILENO_WRONG } from 'src/app/utility/messages/messageVarList';
import { HttpResponse } from '@angular/common/http';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';
import { LoginService } from 'src/app/services/login/login.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BrowserData } from 'src/app/models/browser';
import { User } from 'src/app/pages/models/user';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  hide = true;
  signInModel = new User();
  userForm: FormGroup;
  public browserData: BrowserData;

  
  // Error Messages
  public errorMessage: string;
  public warningMessage: string;
  public successMessage: string;

  constructor(private toastr: ToastServiceService,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar,
    private routerLink: Router, 
    private formBuilder: FormBuilder,
    private loginService: LoginService, 
    private sessionStorage: StorageService,
    public authService: AuthService,
    public route: ActivatedRoute,
    public dialog: MatDialog,) { }

  ngOnInit(): void {

    this.isAuthenticated();
    
    this.initialValidator();
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

initialValidator() {
  this.userForm = this.formBuilder.group({
    // Pattern: Starts with 0, followed by 9 digits
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
  setBrowserData() {
    this.browserData = new BrowserData();
    this.browserData.browserJavaEnabled = window.navigator.javaEnabled();
    this.browserData.browserLanguage = window.navigator.language;
    this.browserData.browserColorDepth = window.screen.colorDepth;
    this.browserData.browserScreenHeight = window.screen.height;
    this.browserData.browserScreenWidth = window.screen.width;
    this.browserData.browserTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.browserData.browserUserAgent = window.navigator.userAgent;
    this.browserData.browserAcceptHeader = 'text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8';
  }


// Inside onSubmit()
onSubmit() {    
  this.errorMessage = null;
  if (this.userForm.valid) {
    this.spinner.show(); // Show spinner when starting
    
    // Use form values directly instead of signInModel
    const loginData = this.userForm.value; 

    this.loginService.login(loginData).subscribe(
      (response) => {
        this.handleSuccess(response);
      },
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
    //token set for session
    this.sessionStorage.setSession(response.headers.get('token'));
    this.sessionStorage.setRefreshToken(response.headers.get('refresh_token'));

    //user details set for session
    this.sessionStorage.setUser(response.body['user'].mobileNo);
    this.sessionStorage.setFullName(response.body['user'].fullName);
    
    this.spinner.hide();
    this.authService.logIn();
  }


  checkIfErrorCodeIsPresent() {
    let errorVal = '';
    this.route
      .queryParams
      .subscribe(params => {
        if (params['errorCode'] !== undefined) {
          errorVal = params['errorCode'];
        }
      });
    if (errorVal !== '') {
      if (CODE_REQUEST_TIMEOUT === errorVal) {
        this.errorMessage = 'Session timeout.';
      } else if (CODE_REQUEST_UNAUTHORIZED === errorVal) {
        this.errorMessage = 'Unauthorized.';
      } else if (CODE_REQUEST_INVALID_USERSESSION === errorVal) {
        this.errorMessage = 'Session expired.';
      }
    }
  }

  checkIfSuccessCodeIsPresent() {
    let successVal = '';
    this.route
      .queryParams
      .subscribe(params => {
        if (params['successCode'] !== undefined) {
          successVal = params['successCode'];
        }
      });
    if (successVal !== '') {
      if (successVal === GLOBAL_SUCCESS_MESSAGE_PASSWORD_CHANGE) {
        this.successMessage = GLOBAL_SUCCESS_MESSAGE_PASSWORD_CHANGE;
      }
    }
  }
  isAuthenticated(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.logIn();
    }
  }


  mandatoryValidation(formGroup: FormGroup) {
    // this.isEmptyThumbnail = false;
    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        const control: FormControl = <FormControl> formGroup.controls[key];
        if (Object.keys(control).includes('controls')) {
          const formGroupChild: FormGroup = <FormGroup> formGroup.controls[key];
          this.mandatoryValidation(formGroupChild);

        }
        control.markAsTouched();
      }
    }
  }

  signUp() {
    this.routerLink.navigateByUrl('/auth/signup')
  }
  forgetPassword() {
    const dialogRef = this.dialog.open(ForgetPasswordComponent, { data: 12, width: '500px', height: '300px' });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onlyNumbers(event: any) {
  const pattern = /[0-9]/;
  const inputChar = String.fromCharCode(event.charCode);
  if (!pattern.test(inputChar)) {
    event.preventDefault();
  }
}
  get mobileNo() {
    return this.userForm.get('mobileNo');
  }

  get password() {
    return this.userForm.get('password');
  }

}
