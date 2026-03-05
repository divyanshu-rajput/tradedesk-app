import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AuthStatusComponent } from './auth-status.component';

jest.mock('../../core/firebase/auth.service', () => {
  const { MockAuthService } = jest.requireActual<
    typeof import('../../core/firebase/auth-service.mock')
  >('../../core/firebase/auth-service.mock');
  return { AuthService: MockAuthService };
});

import { AuthService } from '../../core/firebase/auth.service';

describe('AuthStatusComponent', () => {
  let fixture: ComponentFixture<AuthStatusComponent>;
  let authService: MockAuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthStatusComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([]), AuthService],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(AuthStatusComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render log out for signed-in users', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Log out');
  });

  it('should sign out and navigate to login', async () => {
    await fixture.componentInstance.logOut();

    expect(authService.signOut).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});

type MockAuthService = {
  signOut: jest.Mock;
};
