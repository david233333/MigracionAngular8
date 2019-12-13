import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLineaUnicaComponent } from './modal-linea-unica.component';

describe('ModalLineaUnicaComponent', () => {
  let component: ModalLineaUnicaComponent;
  let fixture: ComponentFixture<ModalLineaUnicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLineaUnicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLineaUnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
