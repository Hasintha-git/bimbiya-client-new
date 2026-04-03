import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-mobile-number-dialog',
  templateUrl: './mobile-number-dialog.component.html',
  styleUrls: ['./mobile-number-dialog.component.scss']
})
export class MobileNumberDialogComponent implements OnInit {

  mobileControl: FormControl = this.fb.control('', [
    Validators.required,
    Validators.pattern(/^0\d{9}$/),
    Validators.minLength(10),
    Validators.maxLength(10)
  ]);
isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    // ✅ Show pre-populated error if backend already flagged the mobile
    if (this.data.initialError) {
      this.errorMessage = this.data.initialError;
    }
  }

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MobileNumberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      email: string;
      fullName: string;
      initialError?: string;           // ✅ add this
      onConfirm: (mobileNo: string, done: (error?: string) => void) => void;
    }
  ) {}

  confirm(): void {
    if (this.mobileControl.invalid) {
      this.mobileControl.markAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // ✅ Call the parent-supplied handler; it tells us when done
    this.data.onConfirm(this.mobileControl.value, (error?: string) => {
      this.isLoading = false;
      if (error) {
        // ✅ API failed — stay open, show error
        this.errorMessage = error;
      } else {
        // ✅ API succeeded — now close
        this.dialogRef.close();
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  onlyNumbers(event: KeyboardEvent): void {
    if (!/[0-9]/.test(String.fromCharCode(event.charCode))) {
      event.preventDefault();
    }
  }
}