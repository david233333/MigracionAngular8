import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVisitaAlertaMensajeComponent } from './modal-visita-alerta-mensaje.component';

describe('ModalVisitaAlertaMensajeComponent', () => {
  let component: ModalVisitaAlertaMensajeComponent;
  let fixture: ComponentFixture<ModalVisitaAlertaMensajeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalVisitaAlertaMensajeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalVisitaAlertaMensajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
