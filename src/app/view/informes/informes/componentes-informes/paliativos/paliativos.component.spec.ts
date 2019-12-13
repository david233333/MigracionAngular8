import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaliativosComponent } from './paliativos.component';

describe('PaliativosComponent', () => {
  let component: PaliativosComponent;
  let fixture: ComponentFixture<PaliativosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaliativosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaliativosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
