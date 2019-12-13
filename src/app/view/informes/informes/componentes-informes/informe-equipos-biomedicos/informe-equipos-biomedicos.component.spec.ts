import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeEquiposBiomedicosComponent } from './informe-equipos-biomedicos.component';

describe('InformeEquiposBiomedicosComponent', () => {
  let component: InformeEquiposBiomedicosComponent;
  let fixture: ComponentFixture<InformeEquiposBiomedicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformeEquiposBiomedicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeEquiposBiomedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
