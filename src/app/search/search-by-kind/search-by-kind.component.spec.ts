import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByKindComponent } from './search-by-kind.component';

describe('SearchByKindComponent', () => {
  let component: SearchByKindComponent;
  let fixture: ComponentFixture<SearchByKindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchByKindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchByKindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
