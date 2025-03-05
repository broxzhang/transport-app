import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, timer, Subscription } from 'rxjs';
import { catchError, tap, switchMap, } from 'rxjs/operators';

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    login: string;
    avatar: string;
  };
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'https://pt.gda.one/api/tests/v1';
  private tokenRenewalSubscription: Subscription | null = null;

  private _isAuthenticated = new BehaviorSubject<boolean>(!!localStorage.getItem('authToken'));
  public isAuthenticated$ = this._isAuthenticated.asObservable();

  constructor(private http: HttpClient) {}

  // token expiration or 401 error, need to re-login
  private _loginRequired = new BehaviorSubject<boolean>(false);
  public loginRequired$ = this._loginRequired.asObservable();


  login(username: string, password: string): Observable<LoginResponse> {
    const url = `${this.apiUrl}/login`;
    const payload = { login: username, password: password };
    return this.http.post<LoginResponse>(url, payload).pipe(

      tap((response: LoginResponse) => {
        localStorage.setItem('authToken', response.access_token);
        this._isAuthenticated.next(true);
        // reset the login required flag
        this._loginRequired.next(false);
        this.startTokenRenewal();
      }),
      catchError(this.handleError)
    );
  }


  logout(): void {
    localStorage.removeItem('authToken');
    this._isAuthenticated.next(false);
    if (this.tokenRenewalSubscription) {
      this.tokenRenewalSubscription.unsubscribe();
      this.tokenRenewalSubscription = null;
    }

    // set the login required flag
    this._loginRequired.next(true);
  }

// token renewal every 5 minutes

  private startTokenRenewal(): void {
    if (this.tokenRenewalSubscription) {
      this.tokenRenewalSubscription.unsubscribe();
    }
    this.tokenRenewalSubscription = timer(5 * 60 * 1000, 5 * 60 * 1000)
      .pipe(
        switchMap(() => this.renewToken())
      )
      .subscribe(
        (newToken: string) => {
          localStorage.setItem('authToken', newToken);
          console.log('Token renewed');
        },
        (error) => {
          if (error.status === 401) {
            this.logout();
          } else {
            console.error('Token renewal error', error);
          }
        }
      );
  }

  renewToken(): Observable<string> {
    const url = `${this.apiUrl}/status`;
    return this.http.get<{ token: string }>(url).pipe(
      tap(() => console.log('Calling renewToken API')),
      switchMap(response => {
        return new Observable<string>(observer => {
          observer.next(response.token);
          observer.complete();
        });
      }),
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(error);
  }
}
