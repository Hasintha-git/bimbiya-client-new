import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonResponse } from 'src/app/models/CommonResponse';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { User } from 'src/app/pages/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoginService } from 'src/app/services/login/login.service';
import { NicValidationService } from 'src/app/services/nic-validation/nic-validation.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpModel = new User();
  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  form4: FormGroup;
  otpForm: FormGroup;
  public districtList: SimpleBase[];
  maxDate = new Date();
  isSubmit: boolean=false;
  step:number =1;
  otp:number;
  otpSend:string;
   hide = true;
    hideConfirm = true;

  public currentTab: number = 1;
  constructor(private toastr: ToastServiceService,
    private userService: LoginService,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    public route: ActivatedRoute,
    private routerLink: Router,
    private nicValidationConfig: NicValidationService,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.prepareReferenceData();
    this.signUpModel.district = "colombo";
    this.initialValidator();
  }

  prepareReferenceData(): void {
    this.userService.getSearchData(true)
      .subscribe((response: any) => {
        this.districtList = response.districtList;
      },
      error => {
        this.toastr.errorMessage(error.error['message']);
      }
    );
  }

  // Method to handle district change event
  onDistrictChange(event: any) {

    this.signUpModel.district = event.value;
}

  passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value; // get password from our password form control
    const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('confirmPassword').setErrors({ NoPassswordMatch: true });
    }
  }


  customNicValidator(isValid: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (isValid) {
        return null; // Return null if the NIC is valid
      } else {
        return { invalidNic: true }; // Return an error object if the NIC is invalid
      }
    };
  }

  onNicInputChange(event: any) {
    if (this.form1.get('nic').valid) {
      const inputValue = event.target.value;
      const dob = this.nicValidationConfig.extractBirthday(inputValue);
      this.signUpModel.dateOfBirth = dob;
    } else {
      this.signUpModel.dateOfBirth = null;
    }
  }

  mandatoryValidation(formGroup: FormGroup) {
    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        const control: FormControl = <FormControl>formGroup.controls[key];
        if (Object.keys(control).includes('controls')) {
          const formGroupChild: FormGroup = <FormGroup>formGroup.controls[key];
          this.mandatoryValidation(formGroupChild);
        }
        control.markAsTouched();
      }
    }
  }

  initialValidator() {
       // this.userForm.get('email').setValidators(Validators.email);

    this.form1 = this.formBuilder.group({
      username: this.formBuilder.control('', [Validators.required]),
      fullName: this.formBuilder.control('', [Validators.required]),
      nic: this.formBuilder.control('', [Validators.required, this.nicValidator()]),
    })
    this.form2 = this.formBuilder.group({
      email: this.formBuilder.control('', [Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]),
      mobile: this.formBuilder.control('', [
        Validators.required,
        Validators.pattern(/^-?([0-9]\d*){10}?$/),
      ]),
    })
    // this.userForm.get('email').setValidators(Validators.email);
    this.form3 = this.formBuilder.group({
      address: this.formBuilder.control('', [Validators.required]),
      city: this.formBuilder.control('', [Validators.required]),
      district: this.formBuilder.control('colombo', [Validators.required]),
    })

    this.form4 = this.formBuilder.group({
      confirmPassword: this.formBuilder.control('', [Validators.required]),
      password: this.formBuilder.control('', [Validators.required])
    }, { validator: this.passwordMatchValidator });

    this.otpForm = this.formBuilder.group({
      otpReq: this.formBuilder.control('', [Validators.required]),
    })
  }

  nicValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const nic = control.value;
      const oldFormat = /^[0-9]{9}[vVxX]$/;
      const newFormat = /^[0-9]{12}$/;
      if (!nic) {
        return null; // consider empty value as valid or use Validators.required to enforce value
      }
      // Validating against the old format
      if (oldFormat.test(nic)) {
        return null;
      }
      // Validating new NIC format
      if (newFormat.test(nic)) {
        return null;
      }
      // NIC doesn't match any valid format
      return { 'invalidNic': { value: nic, reason: 'Does not match any NIC format' } };
    };
  }
  onSubmit() {

    this.signUpModel.status ="active";
    this.signUpModel.userRole = 'client';
      this.userService.add(this.signUpModel).subscribe(
        (response: CommonResponse) => {

          this.otpSend = response.responseDescription;
          this.step = 5;
        },
        error => {

            this.toastr.errorMessage(error.error['errorDescription']);
        }
      );
  }

  otpConfirm() {

      this.userService.otpConfirm(this.otp, this.signUpModel.username).subscribe(
        (response: CommonResponse) => {

          this.signIn();
        },
        error => {

            this.toastr.errorMessage(error.error['errorDescription']);
        }
      );
  }

  signIn() {
    this.routerLink.navigateByUrl('/auth/signin')
  }

  backPrev() {
    if(this.step != 1) {
      this.step -=1;
    }
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  submitData() {

    if (this.form4.valid  && this.step==4) {
      this.onSubmit();
    } else {
      this.mandatoryValidation(this.form4)
    }
  }

  nextPrev(n: number): void {
    console.log("nnnnnnnnnn", n);

    const forms = [this.form1, this.form2, this.form3, this.form4];

    console.log("step", this.step);
    if (this.step >= 1 && this.step <= 4) {
      if (forms[this.step - 1].valid) {
        console.log("step 2", this.step);
        this.step += 1;

        if (this.step === 5) {
          this.onSubmit();
        }
      } else {
        console.log("mandatoryValidation", this.step);
        this.mandatoryValidation(forms[this.step - 1]);
      }
    }
  }


get fullName() {
  return this.form1.get('fullName');
}
get password() {
  return this.form4.get('password');
}
get nic() {
  return this.form1.get('nic');
}

get dob() {
  return this.form1.get('dob');
}

get email() {
  return this.form2.get('email');
}

get username() {
  return this.form1.get('username');
}

get mobile() {
  return this.form2.get('mobile');
}

get address() {
  return this.form3.get('address');
}

get city() {
  return this.form3.get('city');
}

get distr() {
  return this.form3.get('district');
}
get confirmPassword() {
  return this.form4.get('confirmPassword');
}
get otpReq() {
  return this.otpForm.get('otpReq');
}
}
