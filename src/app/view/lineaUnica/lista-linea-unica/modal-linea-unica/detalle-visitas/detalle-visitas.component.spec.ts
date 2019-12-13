import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleVisitasComponent } from './detalle-visitas.component';

describe('DetalleVisitasComponent', () => {
  let component: DetalleVisitasComponent;
  let fixture: ComponentFixture<DetalleVisitasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleVisitasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleVisitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
