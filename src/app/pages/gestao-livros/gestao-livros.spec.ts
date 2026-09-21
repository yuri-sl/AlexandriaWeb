import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoLivros } from './gestao-livros';

describe('GestaoLivros', () => {
  let component: GestaoLivros;
  let fixture: ComponentFixture<GestaoLivros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), MessageService],
      imports: [GestaoLivros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestaoLivros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

