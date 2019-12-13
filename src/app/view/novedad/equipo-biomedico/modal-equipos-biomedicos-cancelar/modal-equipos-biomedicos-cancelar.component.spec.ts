import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEquiposBiomedicosCancelarComponent } from './modal-equipos-biomedicos-cancelar.component';

describe('ModalEquiposBiomedicosCancelarComponent', () => {
  let component: ModalEquiposBiomedicosCancelarComponent;
  let fixture: ComponentFixture<ModalEquiposBiomedicosCancelarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEquiposBiomedicosCancelarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEquiposBiomedicosCancelarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
