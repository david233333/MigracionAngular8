import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertasVisitasComponent } from './alertas-visitas.component';
TestBed.configureTestingModule({
  declarations: [AlertasVisitasComponent],
})

describe('AlertasVisitasComponent', () => {
  let component: AlertasVisitasComponent;
  let fixture: ComponentFixture<AlertasVisitasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertasVisitasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertasVisitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
