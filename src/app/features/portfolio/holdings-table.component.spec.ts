import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { mockAppState } from '../../state/testing/mock-app-state';
import { HoldingsTableComponent } from './holdings-table.component';

describe('HoldingsTableComponent', () => {
  let fixture: ComponentFixture<HoldingsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoldingsTableComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({ initialState: mockAppState }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HoldingsTableComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
