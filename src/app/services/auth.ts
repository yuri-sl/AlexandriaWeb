import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  token: string;
}

interface JwtPayload {
  sub?: string;
  role?: string;
  roles?: string[];
  authorities?: string[];
  exp?: number;
  [key: string]: unknown;
}

const TOKEN_KEY = 'alx_token';

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly apiUrl = 'http://localhost:8080/auth/login';

  private readonly tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  private readonly payload = computed<JwtPayload | null>(() => this.decode(this.tokenSignal()));

  /** True only for a token that exists and has not expired. */
  readonly isAuthenticated = computed(() => {
    const p = this.payload();
    if (!p) return false;
    if (p.exp && Date.now() >= p.exp * 1000) return false;
    return true;
  });

  /** True when the logged-in user carries an ADMIN role/authority. */
  readonly isAdmin = computed(() => {
    if (!this.isAuthenticated()) return false;
    const p = this.payload();
    const candidatos = [
      p?.role,
      ...(Array.isArray(p?.roles) ? p!.roles : []),
      ...(Array.isArray(p?.authorities) ? p!.authorities : []),
    ].filter((r): r is string => typeof r === 'string');
    return candidatos.some((r) => r.toUpperCase().includes('ADMIN'));
  });

  readonly usuario = computed(() => (this.isAuthenticated() ? this.payload()?.sub ?? null : null));

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.apiUrl, { email, senha })
      .pipe(tap((res) => this.setToken(res.token)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.tokenSignal.set(null);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.tokenSignal.set(token);
  }

  private decode(token: string | null): JwtPayload | null {
    if (!token) return null;
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join(''),
      );
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }
}
