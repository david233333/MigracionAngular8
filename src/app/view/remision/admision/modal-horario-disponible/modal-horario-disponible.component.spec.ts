import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHorarioDisponibleComponent } from './modal-horario-disponible.component';

describe('ModalHorarioDisponibleComponent', () => {
  let component: ModalHorarioDisponibleComponent;
  let fixture: ComponentFixture<ModalHorarioDisponibleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalHorarioDisponibleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalHorarioDisponibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
