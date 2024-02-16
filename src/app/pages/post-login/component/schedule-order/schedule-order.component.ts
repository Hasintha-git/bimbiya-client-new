import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { CartDetails } from 'src/app/models/cart-details';
import { AddToCartService } from 'src/app/services/Cart/add-to-cart.service';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';

@Component({
  selector: 'app-schedule-order',
  templateUrl: './schedule-order.component.html',
  styleUrls: ['./schedule-order.component.scss']
})
export class ScheduleOrderComponent implements OnInit {

  public cartModelForm: FormGroup;
  cartModelAdd = new CartDetails();
  public countList: number[];


  constructor(private dialogRef: MatDialogRef<ScheduleOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private addToCartService: AddToCartService,
    public toastService: ToastServiceService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.countList= [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
    this.initialForm();
  }

  initialForm() {
    this.cartModelForm = this.formBuilder.group({
      scheduleTime: this.formBuilder.control(''),
      pCount: this.formBuilder.control(''),
    });

  }
  onSubmit() {

  }

  closeDialog() {
    this.dialogRef.close();
  }

  resetForm() {
    this.cartModelForm.reset();
  }

  get scheduleTime() {
    return this.cartModelForm.get('scheduleTime');
  }
  get pCount() {
    return this.cartModelForm.get('pCount');
  }
}
