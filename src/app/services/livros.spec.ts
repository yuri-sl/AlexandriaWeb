import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { TestBed } from '@angular/core/testing';

import { Livros } from './livros';

describe('Livros', () => {
  let service: Livros;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), MessageService],});
    service = TestBed.inject(Livros);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

