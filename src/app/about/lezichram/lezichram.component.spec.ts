import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LezichramComponent } from './lezichram.component';

describe('LezichramComponent', () => {
  let component: LezichramComponent;
  let fixture: ComponentFixture<LezichramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LezichramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LezichramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
