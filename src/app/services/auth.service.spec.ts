import { TestBed } from '@angular/core/testing';
import { AuthService, LoginResponse } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully and store token', () => {
    const dummyResponse = {
      access_token: 'test-token',
      token_type: 'Bearer',
      user: { id: '1', login: 'User1', avatar: '' }
    };

    service.login('User1', '12345').subscribe((res: LoginResponse) => {
      expect(res.access_token).toBe(dummyResponse.access_token);
      expect(localStorage.getItem('authToken')).toBe(dummyResponse.access_token);
    });

    const req = httpMock.expectOne('https://pt.gda.one/api/tests/v1/login');
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should logout and clear token', () => {
    localStorage.setItem('authToken', 'test-token');
    service.logout();
    expect(localStorage.getItem('authToken')).toBeNull();
  });
});
