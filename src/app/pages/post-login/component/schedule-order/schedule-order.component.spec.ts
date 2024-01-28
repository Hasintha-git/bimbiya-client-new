import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleOrderComponent } from './schedule-order.component';

describe('ScheduleOrderComponent', () => {
  let component: ScheduleOrderComponent;
  let fixture: ComponentFixture<ScheduleOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
