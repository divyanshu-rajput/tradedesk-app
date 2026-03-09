import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { mockAppState } from '../../state/testing/mock-app-state';
import { WatchlistRowComponent } from './watchlist-row.component';

describe('WatchlistRowComponent', () => {
  let fixture: ComponentFixture<WatchlistRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchlistRowComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({ initialState: mockAppState }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WatchlistRowComponent);
    fixture.componentRef.setInput('symbol', 'BTCUSDT');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should format symbol for display', () => {
    expect(fixture.componentInstance.displaySymbol()).toBe('BTC/USDT');
  });
});
