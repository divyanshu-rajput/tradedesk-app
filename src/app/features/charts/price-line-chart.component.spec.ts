import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceLineChartComponent } from './price-line-chart.component';

describe('PriceLineChartComponent', () => {
  let fixture: ComponentFixture<PriceLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceLineChartComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(PriceLineChartComponent);
    fixture.componentRef.setInput('symbol', 'BTCUSDT');
    fixture.componentRef.setInput('prices', [100, 101, 102]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
