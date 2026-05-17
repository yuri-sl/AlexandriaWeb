import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoLivros } from './gestao-livros';

describe('GestaoLivros', () => {
  let component: GestaoLivros;
  let fixture: ComponentFixture<GestaoLivros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
