import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BebeCanguroComponent } from './bebe-canguro.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

describe('BebeCanguroComponent', () => {
  let component: BebeCanguroComponent;
  let fixture: ComponentFixture<BebeCanguroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BebeCanguroComponent ],
      imports: [ BrowserModule,
        FormsModule,
        ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BebeCanguroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
