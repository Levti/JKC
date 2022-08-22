import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByPeriodComponent } from './search-by-period.component';

describe('SearchByPeriodComponent', () => {
  let component: SearchByPeriodComponent;
  let fixture: ComponentFixture<SearchByPeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchByPeriodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchByPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
