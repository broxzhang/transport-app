import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, timer, Subscription } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';

interface LoginResponse {
  token: string;
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


  login(username: string, password: string): Observable<LoginResponse> {
    const url = `${this.apiUrl}/login`;
    const payload = { login: username, password: password };
    return this.http.post<LoginResponse>(url, payload).pipe(
      tap((response: LoginResponse) => {
        localStorage.setItem('authToken', response.token);
        this._isAuthenticated.next(true);
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
    }
  }


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
        },
        (error) => {
          // 如果返回 401，则自动登出，并在应用中弹出登录窗（这里可以扩展通知逻辑）
          if (error.status === 401) {
            this.logout();
          }
        }
      );
  }

  renewToken(): Observable<string> {
    const url = `${this.apiUrl}/status`;
    return this.http.get<{ token: string }>(url).pipe(
      tap(() => console.log('Token renewed')),
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
