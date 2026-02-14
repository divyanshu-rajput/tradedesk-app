import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PriceFlashDirective } from './price-flash.directive';

@Component({
  standalone: true,
  imports: [PriceFlashDirective],
  template: `<span [priceFlash]="price()"></span>`,
})
class HostComponent {
  readonly price = signal(100);
}

describe('PriceFlashDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('adds up class when price increases', () => {
    const el: HTMLElement = fixture.debugElement.query(By.css('span')).nativeElement;

    fixture.componentInstance.price.set(110);
    fixture.detectChanges();

    expect(el.classList.contains('price-flash-up')).toBe(true);
  });

  it('removes flash class on animationend', () => {
    const el: HTMLElement = fixture.debugElement.query(By.css('span')).nativeElement;

    fixture.componentInstance.price.set(90);
    fixture.detectChanges();
    expect(el.classList.contains('price-flash-down')).toBe(true);

    el.dispatchEvent(new Event('animationend'));
    expect(el.classList.contains('price-flash-down')).toBe(false);
  });
});
