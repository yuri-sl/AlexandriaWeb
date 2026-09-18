import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Estante } from './estante';

describe('Estante', () => {
  let component: Estante;
  let fixture: ComponentFixture<Estante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Estante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Estante);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
