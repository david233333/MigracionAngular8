import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PacModalComponent } from './pac-modal.component';

describe('PacModalComponent', () => {
  let component: PacModalComponent;
  let fixture: ComponentFixture<PacModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PacModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PacModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
/*

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/
