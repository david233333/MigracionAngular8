import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEdicionNovedadesComponent } from './modal-edicion-novedades.component';

describe('ModalEdicionNovedadesComponent', () => {
  let component: ModalEdicionNovedadesComponent;
  let fixture: ComponentFixture<ModalEdicionNovedadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEdicionNovedadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEdicionNovedadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
