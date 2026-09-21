import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Catalog } from './catalog';
import { BOOK_FIXTURES } from '../testing/book-fixtures';
describe('Catalog API adapter', () => {
  let catalog: Catalog;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    catalog = TestBed.inject(Catalog);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('loads real responses and avoids duplicate in-flight requests', () => {
    catalog.load();
    catalog.load();
    expect(catalog.loading()).toBe(true);
    http.expectOne('http://localhost:8080/livro').flush(BOOK_FIXTURES);
    expect(catalog.books()).toEqual(BOOK_FIXTURES);
    expect(catalog.loading()).toBe(false);
    catalog.load();
    http.expectNone('http://localhost:8080/livro');
  });
  it('keeps failures distinct from empty data and allows retry', () => {
    catalog.load();
    http
      .expectOne('http://localhost:8080/livro')
      .flush('offline', { status: 503, statusText: 'Unavailable' });
    expect(catalog.books()).toEqual([]);
    expect(catalog.error()).not.toBe('');
    catalog.load(true);
    http.expectOne('http://localhost:8080/livro').flush([]);
    expect(catalog.error()).toBe('');
    expect(catalog.books()).toEqual([]);
    expect(catalog.loaded()).toBe(true);
  });
  it('accepts the legacy single-book response', () => {
    catalog.load();
    http.expectOne('http://localhost:8080/livro').flush(BOOK_FIXTURES[0]);
    expect(catalog.books()).toEqual([BOOK_FIXTURES[0]]);
  });
});
