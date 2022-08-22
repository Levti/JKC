import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistanceTimeComponent } from './distance-time.component';

describe('DistanceTimeComponent', () => {
  let component: DistanceTimeComponent;
  let fixture: ComponentFixture<DistanceTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistanceTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistanceTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
