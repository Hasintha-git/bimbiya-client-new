import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {  FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
// import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EmailSent } from 'src/app/models/email-sent';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ForgetPasswordComponent implements OnInit {
 
  mgtForm: FormGroup;
  emailSent: EmailSent = new EmailSent();
  maxDate = new Date();

  imageFile: File = null;
  isEmptyThumbnail = true;
  thumbnailImage:any;

  constructor(
    public dialogRef: MatDialogRef<ForgetPasswordComponent>,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.mgtForm = this.formBuilder.group({
      toEmail: ['', [Validators.required]],
    });
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

  reset() {
    this.mgtForm.reset();
  }

  onSubmit() {
    if (this.mgtForm.valid) {
  
    } else {
      this.mandatoryValidation(this.mgtForm)
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

  get toEmail() {
    return this.mgtForm.get('toEmail');
  }


  closeDialog() {
    this.dialogRef.close();
  }

}
