import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OKComponent } from './ok.component';

describe('OKComponent', () => {
  let component: OKComponent;
  let fixture: ComponentFixture<OKComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OKComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OKComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
