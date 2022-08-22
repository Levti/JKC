import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteConstructionComponent } from './site-construction.component';

describe('SiteConstructionComponent', () => {
  let component: SiteConstructionComponent;
  let fixture: ComponentFixture<SiteConstructionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteConstructionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteConstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
