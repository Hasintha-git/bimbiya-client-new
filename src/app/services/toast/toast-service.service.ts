import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastServiceService {

  constructor(   private toastr: ToastrService,) { }

  successMessage(msg:any) {
    this.toastr.success(msg,null,{
      toastClass: "success-custome"
    });
  }

  errorMessage(msg:any) {
    this.toastr.error(msg,null,{
      toastClass: "error-custome"
    });
  }

  infoMessage(msg:any) {
    this.toastr.info(msg,null,{
      toastClass: "info-custome"
    });
  }
}
