import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheCenterComponent } from './the-center.component';

describe('TheCenterComponent', () => {
  let component: TheCenterComponent;
  let fixture: ComponentFixture<TheCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
