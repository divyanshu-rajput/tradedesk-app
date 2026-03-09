import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { mockAppState } from '../../state/testing/mock-app-state';
import MarketWatchComponent from './market-watch.component';

describe('MarketWatchComponent', () => {
  let fixture: ComponentFixture<MarketWatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketWatchComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({ initialState: mockAppState }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketWatchComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
