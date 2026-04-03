import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileNumberDialogComponent } from './mobile-number-dialog.component';

describe('MobileNumberDialogComponent', () => {
  let component: MobileNumberDialogComponent;
  let fixture: ComponentFixture<MobileNumberDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileNumberDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileNumberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
