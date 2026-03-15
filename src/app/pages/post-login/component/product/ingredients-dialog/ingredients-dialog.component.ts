import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface IngredientsDialogData {
  product: any;
}

@Component({
  selector: 'app-ingredients-dialog',
  templateUrl: './ingredients-dialog.component.html',
  styleUrls: ['./ingredients-dialog.component.scss']
})
export class IngredientsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<IngredientsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IngredientsDialogData
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  trackByIngredient(index: number, ingredient: any): number {
    return ingredient.id;
  }
}