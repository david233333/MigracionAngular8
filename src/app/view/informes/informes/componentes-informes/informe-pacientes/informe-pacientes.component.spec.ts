import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformePacientesComponent } from './informe-pacientes.component';

describe('InformePacientesComponent', () => {
  let component: InformePacientesComponent;
  let fixture: ComponentFixture<InformePacientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformePacientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformePacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
