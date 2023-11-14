import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable, catchError, map, of, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';

import { AuthStatus } from '../enums';
import {
  User,
  LoginResponse,
  TokenResponse,
  RegisterResponse,
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private readonly baseUrl: string = environment.apiUrl;

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  public setAuthStatus(status: AuthStatus) {
    this._authStatus.set(status);
  }

  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  public login(email: string, password: string): Observable<boolean> {
    const url: string = `${this.baseUrl}/auth/login`;

    const body = { email, password };

    return this.httpClient.post<LoginResponse>(url, body).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),

      catchError((err) =>
        throwError(() => {
          if (err.error.message) {
            return 'Invalid Credentials';
          } else {
            return 'Internal Server Error';
          }
        })
      )
    );
  }

  public register(
    name: string,
    email: string,
    password: string
  ): Observable<boolean> {
    const url: string = `${this.baseUrl}/auth/register`;

    const body = { name, email, password };

    return this.httpClient.post<RegisterResponse>(url, body).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),

      catchError((err) =>
        throwError(() => {
          if (err.error.message) {
            return err.error.message;
          } else {
            return 'Internal Server Error';
          }
        })
      )
    );
  }

  public checkAuthStatus(): Observable<boolean> {
    const url: string = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers: HttpHeaders = new HttpHeaders().set(
      'Authorization',
      `Bearer ${token}`
    );

    return this.httpClient.get<TokenResponse>(url, { headers }).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),

      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated);

        return of(false);
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }
}
