import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDireccionComponent } from './modal-direccion.component';

describe('ModalDireccionComponent', () => {
  let component: ModalDireccionComponent;
  let fixture: ComponentFixture<ModalDireccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDireccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDireccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
