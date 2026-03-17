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

  // ── Safely extract ingredient name ───────────────
  // Handles: string, { description }, { name }, { ingredientsName }
  getIngredientName(ing: any): string {
    if (!ing && ing !== 0) return '';
    if (typeof ing === 'string') return ing;
    if (typeof ing === 'object') {
      return ing.description
        ?? ing.name
        ?? ing.ingredientsName
        ?? ing.ingredient
        ?? ing.label
        ?? Object.values(ing).find(v => typeof v === 'string') as string
        ?? '';
    }
    return String(ing);
  }

  // ── Safe ingredients array ────────────────────────
  get ingredients(): any[] {
    const raw = this.data?.product?.ingredients;
    if (!raw || !Array.isArray(raw)) return [];
    return raw.filter(i => i !== null && i !== undefined && i !== '');
  }

  trackByIngredient(index: number, _: any): number {
    return index;
  }
}