import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsDialogComponent } from './ingredients-dialog.component';

describe('IngredientsDialogComponent', () => {
  let component: IngredientsDialogComponent;
  let fixture: ComponentFixture<IngredientsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngredientsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
