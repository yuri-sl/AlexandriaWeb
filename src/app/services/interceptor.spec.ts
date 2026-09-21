import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './authInterceptor';
import { Auth } from './auth';
describe('authInterceptor', () => {
  const token = { value: null as string | null };
  beforeEach(() => {
    token.value = null;
    TestBed.configureTestingModule({ providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting(), { provide: Auth, useValue: { getToken: () => token.value } }] });
  });
  afterEach(() => TestBed.inject(HttpTestingController).verify());
  it('preserves anonymous requests', () => {
    TestBed.inject(HttpClient).get('/livro').subscribe();
    const request = TestBed.inject(HttpTestingController).expectOne('/livro');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush([]);
  });
  it('preserves the bearer authentication contract', () => {
    token.value = 'test-token';
    TestBed.inject(HttpClient).get('/livro').subscribe();
    const request = TestBed.inject(HttpTestingController).expectOne('/livro');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');
    request.flush([]);
  });
});
