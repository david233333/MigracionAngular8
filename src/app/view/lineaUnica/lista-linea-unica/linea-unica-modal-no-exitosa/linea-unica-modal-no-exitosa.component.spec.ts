import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineaUnicaModalNoExitosaComponent } from './linea-unica-modal-no-exitosa.component';

describe('LineaUnicaModalNoExitosaComponent', () => {
  let component: LineaUnicaModalNoExitosaComponent;
  let fixture: ComponentFixture<LineaUnicaModalNoExitosaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineaUnicaModalNoExitosaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineaUnicaModalNoExitosaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
