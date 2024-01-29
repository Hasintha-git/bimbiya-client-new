import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { NgxSpinnerService } from "ngx-spinner";
import { CODE_REQUEST_INVALID_USERSESSION, CODE_REQUEST_TIMEOUT, CODE_REQUEST_UNAUTHORIZED, GATEWAY_TIMEOUT_ERROR_CODE, GLOBAL_SUCCESS_MESSAGE_PASSWORD_CHANGE, INTERNAL_SERVER_ERROR_CODE, NOT_FOUND_ERROR_CODE, PASSWORD_WRONG, UNABLE_TO_SERVE_REQUEST_DES, UNAUTH_ERROR_CODE, USERNAME_WRONG } from 'src/app/utility/messages/messageVarList';
import { HttpResponse } from '@angular/common/http';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';
import { LoginService } from 'src/app/services/login/login.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BrowserData } from 'src/app/models/browser';
import { User } from 'src/app/pages/models/user';
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
    public route: ActivatedRoute,) { }

  ngOnInit(): void {

    this.isAuthenticated();
    
    this.initialValidator();
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  initialValidator() {
    this.userForm = this.formBuilder.group({
      username: this.formBuilder.control('', [Validators.required]),
      password: this.formBuilder.control('', [Validators.required])
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


onSubmit() {    
  this.errorMessage = null;
    if (this.userForm.valid) {
      this.spinner.show();
      this.loginService.login(this.signInModel).subscribe(
        (response: HttpResponse<any>) => {
          console.log('Response Headers:', response.headers.keys()); 
          const authorizationHeader = response.headers.get('Authorization');
          const refreshTokenHeader = response.headers.get('Refresh-Token');
          
          // if (authorizationHeader) {
            this.sessionStorage.setSession(authorizationHeader);
          // }
      
          // if (refreshTokenHeader) {
            this.sessionStorage.setRefreshToken(refreshTokenHeader);
          // }
          this.authService.logIn();
        },
        (        error: { status: number; error: { [x: string]: string; }; }) => {
          if (error.status === GATEWAY_TIMEOUT_ERROR_CODE || error.status === INTERNAL_SERVER_ERROR_CODE) {
            this.errorMessage = UNABLE_TO_SERVE_REQUEST_DES;
            this.spinner.hide();
          }else if(error.status === NOT_FOUND_ERROR_CODE) {
            this.errorMessage = USERNAME_WRONG;
            this.spinner.hide();
          }else if(error.status === UNAUTH_ERROR_CODE) {
            this.errorMessage = PASSWORD_WRONG;
            this.spinner.hide();
          }
           else {
            this.errorMessage = error.error['message'];
            this.spinner.hide();
          }
          
          console.log("errorMessage",this.errorMessage)
          this.toastr.errorMessage(this.errorMessage);
        }
      );
    } else {
      this.toastr.errorMessage('Please fill in all required fields');
      this.spinner.hide();
      this.mandatoryValidation(this.userForm)
    }
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
      console.log("***********")
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
    this.routerLink.navigateByUrl('/register')
  }

  get username() {
    return this.userForm.get('username');
  }

  get password() {
    return this.userForm.get('password');
  }

}
