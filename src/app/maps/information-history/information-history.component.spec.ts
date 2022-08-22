import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationHistoryComponent } from './information-history.component';

describe('InformationHistoryComponent', () => {
  let component: InformationHistoryComponent;
  let fixture: ComponentFixture<InformationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
