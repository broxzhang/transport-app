import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceStub: Partial<AuthService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    authServiceStub = {
      isAuthenticated$: of(false),
      loginRequired$: of(false),
      logout: jasmine.createSpy('logout')
    };

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [NoopAnimationsModule, MatToolbarModule, MatButtonModule],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Sign In" button when not authenticated', () => {
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.textContent).toContain('Sign In');
  });

  it('should call logout when "Logout" button is clicked', () => {
    // Simulate authenticated state
    authServiceStub.isAuthenticated$ = of(true);
    fixture.detectChanges();
    const logoutButton = fixture.debugElement.query(By.css('button'));
    logoutButton.triggerEventHandler('click', null);
    expect(authServiceStub.logout).toHaveBeenCalled();
  });
});
