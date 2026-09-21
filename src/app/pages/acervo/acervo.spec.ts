import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { Acervo } from './acervo';
import { BOOK_FIXTURES } from '../../testing/book-fixtures';
describe('Acervo search and filters', () => {
  const params = new BehaviorSubject(convertToParamMap({}));
  function create(commercial = true) {
    TestBed.configureTestingModule({
      imports: [Acervo],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: params,
            snapshot: { queryParamMap: params.value, data: { commercial } },
          },
        },
      ],
    });
    const fixture = TestBed.createComponent(Acervo);
    TestBed.inject(HttpTestingController)
      .expectOne('http://localhost:8080/livro')
      .flush(BOOK_FIXTURES);
    return fixture;
  }
  beforeEach(() => params.next(convertToParamMap({})));
  afterEach(() => TestBed.inject(HttpTestingController).verify());
  it('combines accent-insensitive search, area, author, stock and price', () => {
    const component = create().componentInstance;
    params.next(
      convertToParamMap({
        q: 'computacao',
        area: 'Computação',
        autor: 'Ana Silva',
        disponivel: 'true',
        preco: '60',
      }),
    );
    expect(component.filtered().map((book) => book.id)).toEqual([101]);
    params.next(convertToParamMap({ preco: '0' }));
    expect(component.filtered()).toEqual([]);
  });
  it('sorts by price and resets pagination when query parameters change', () => {
    const component = create().componentInstance;
    component.first.set(12);
    params.next(convertToParamMap({ ordem: 'preco-desc' }));
    expect(component.filtered().map((book) => book.id)).toEqual([102, 103, 101]);
    expect(component.first()).toBe(0);
  });
  it('ignores commercial price filters and hides prices in the academic view', () => {
    const fixture = create(false);
    params.next(convertToParamMap({ preco: '0' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.filtered().length).toBe(3);
    expect(fixture.nativeElement.querySelector('.price-row')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('R$');
  });
  it('keeps the displayed price shared by both PrimeNG controls', async () => {
    const fixture = create();
    params.next(convertToParamMap({ preco: '60' }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.price()).toBe(60);
    expect(fixture.nativeElement.querySelector('p-inputnumber input').value).toContain('60');
    expect(
      fixture.nativeElement.querySelector('p-slider [role="slider"]').getAttribute('aria-valuenow'),
    ).toBe('60');
  });
});
