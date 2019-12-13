import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaMaestroComponent } from './tabla-maestro.component';

describe('TablaMaestroComponent', () => {
  let component: TablaMaestroComponent;
  let fixture: ComponentFixture<TablaMaestroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaMaestroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaMaestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
