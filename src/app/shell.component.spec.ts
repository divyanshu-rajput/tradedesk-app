import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

jest.mock('./core/firebase/auth.service', () => {
  const { MockAuthService } = jest.requireActual<
    typeof import('./core/firebase/auth-service.mock')
  >('./core/firebase/auth-service.mock');
  return { AuthService: MockAuthService };
});

import { AuthService } from './core/firebase/auth.service';
import ShellComponent from './shell.component';

describe('ShellComponent', () => {
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([]), AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render TradeDesk title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1.shell__title')?.textContent).toContain('TradeDesk');
  });
});
