import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarBottomComponent } from './nav-bar-bottom.component';

describe('NavBarBottomComponent', () => {
  let component: NavBarBottomComponent;
  let fixture: ComponentFixture<NavBarBottomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavBarBottomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
