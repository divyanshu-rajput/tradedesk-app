import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationChartComponent } from './allocation-chart.component';

describe('AllocationChartComponent', () => {
  let fixture: ComponentFixture<AllocationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocationChartComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(AllocationChartComponent);
    fixture.componentRef.setInput('data', [
      { symbol: 'BTCUSDT', label: 'BTC/USDT', value: 100, color: '#3b82f6' },
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
