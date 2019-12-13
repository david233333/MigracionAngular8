import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMedicamentoComponent } from './detalle-medicamento.component';

describe('DetalleMedicamentoComponent', () => {
  let component: DetalleMedicamentoComponent;
  let fixture: ComponentFixture<DetalleMedicamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleMedicamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleMedicamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
