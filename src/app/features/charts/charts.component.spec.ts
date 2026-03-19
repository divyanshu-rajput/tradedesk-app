import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { mockAppState } from '../../state/testing/mock-app-state';
import ChartsComponent from './charts.component';

describe('ChartsComponent', () => {
  let fixture: ComponentFixture<ChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartsComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({ initialState: mockAppState }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartsComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
