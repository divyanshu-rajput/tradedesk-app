import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { mockAppState } from '../../state/testing/mock-app-state';
import { OrderHistoryListComponent } from './order-history-list.component';

describe('OrderHistoryListComponent', () => {
  let fixture: ComponentFixture<OrderHistoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderHistoryListComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({ initialState: mockAppState }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderHistoryListComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
