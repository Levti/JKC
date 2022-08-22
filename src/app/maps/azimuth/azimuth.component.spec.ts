import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AzimuthComponent } from './azimuth.component';

describe('AzimuthComponent', () => {
  let component: AzimuthComponent;
  let fixture: ComponentFixture<AzimuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AzimuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AzimuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
