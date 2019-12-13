import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaLineaUnicaComponent } from './lista-linea-unica.component';

describe('ListaLineaUnicaComponent', () => {
  let component: ListaLineaUnicaComponent;
  let fixture: ComponentFixture<ListaLineaUnicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaLineaUnicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaLineaUnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
