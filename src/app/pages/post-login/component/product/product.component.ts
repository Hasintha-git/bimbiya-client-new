import { Component, OnInit, Input } from '@angular/core';
import { ScheduleOrderComponent } from '../schedule-order/schedule-order.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() product: any;

  constructor(   public dialog: MatDialog,) { }

  ngOnInit(): void {
  }

  scheduleOrder() {
    const dialogRef = this.dialog.open(ScheduleOrderComponent, { width: '550px', height: '220px' });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
