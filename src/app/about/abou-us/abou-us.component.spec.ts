import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbouUsComponent } from './abou-us.component';

describe('AbouUsComponent', () => {
  let component: AbouUsComponent;
  let fixture: ComponentFixture<AbouUsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbouUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbouUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
