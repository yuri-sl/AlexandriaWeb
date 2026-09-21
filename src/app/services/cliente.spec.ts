import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { TestBed } from '@angular/core/testing';

import { Cliente } from './cliente';

describe('Cliente', () => {
  let service: Cliente;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), MessageService],});
    service = TestBed.inject(Cliente);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

