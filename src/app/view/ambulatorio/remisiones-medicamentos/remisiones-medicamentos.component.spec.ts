import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemisionesMedicamentosComponent } from './remisiones-medicamentos.component';

describe('RemisionesMedicamentosComponent', () => {
  let component: RemisionesMedicamentosComponent;
  let fixture: ComponentFixture<RemisionesMedicamentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemisionesMedicamentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemisionesMedicamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
