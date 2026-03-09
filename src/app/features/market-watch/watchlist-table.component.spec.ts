import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { mockAppState } from '../../state/testing/mock-app-state';
import { WatchlistTableComponent } from './watchlist-table.component';

describe('WatchlistTableComponent', () => {
  let fixture: ComponentFixture<WatchlistTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchlistTableComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({ initialState: mockAppState }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WatchlistTableComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render watchlist symbols', () => {
    expect(fixture.componentInstance.symbols.length).toBeGreaterThan(0);
  });
});
