import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBySourceComponent } from './search-by-source.component';

describe('SearchBySourceComponent', () => {
  let component: SearchBySourceComponent;
  let fixture: ComponentFixture<SearchBySourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBySourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBySourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
