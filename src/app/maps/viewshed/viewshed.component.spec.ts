import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewshedComponent } from './viewshed.component';

describe('ViewshedComponent', () => {
  let component: ViewshedComponent;
  let fixture: ComponentFixture<ViewshedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewshedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewshedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
