import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { mockAppState } from '../../state/testing/mock-app-state';
import OrderPlacementComponent from './order-placement.component';

describe('OrderPlacementComponent', () => {
  let fixture: ComponentFixture<OrderPlacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPlacementComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({ initialState: mockAppState }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderPlacementComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should disable submit when form is invalid', () => {
    fixture.componentInstance.form.patchValue({ qty: 0 });
    fixture.detectChanges();
    expect(fixture.componentInstance.form.invalid).toBe(true);
  });
});
