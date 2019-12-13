import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarRecursoPreferidoComponent } from './asignar-recurso-preferido.component';

describe('AsignarRecursoPreferidoComponent', () => {
  let component: AsignarRecursoPreferidoComponent;
  let fixture: ComponentFixture<AsignarRecursoPreferidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarRecursoPreferidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarRecursoPreferidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
