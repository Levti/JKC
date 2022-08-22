import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByLocationComponent } from './search-by-location.component';

describe('SearchByLocationComponent', () => {
  let component: SearchByLocationComponent;
  let fixture: ComponentFixture<SearchByLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchByLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchByLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
