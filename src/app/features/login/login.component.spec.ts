import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

jest.mock('../../core/firebase/auth.service', () => {
  const { MockAuthService } = jest.requireActual<
    typeof import('../../core/firebase/auth-service.mock')
  >('../../core/firebase/auth-service.mock');
  return { AuthService: MockAuthService };
});

import { AuthService } from '../../core/firebase/auth.service';
import LoginComponent from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([]), AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render sign-in options', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1.login__title')?.textContent).toContain(
      'Welcome to TradeDesk',
    );
    expect(compiled.textContent).toContain('Sign in with Google');
    expect(compiled.textContent).toContain('Continue as guest');
  });
});
