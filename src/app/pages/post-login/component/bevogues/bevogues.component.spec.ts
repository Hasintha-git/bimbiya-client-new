import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BevoguesComponent } from './bevogues.component';

describe('BevoguesComponent', () => {
  let component: BevoguesComponent;
  let fixture: ComponentFixture<BevoguesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BevoguesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BevoguesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
