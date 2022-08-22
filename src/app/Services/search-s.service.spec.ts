import { TestBed } from '@angular/core/testing';

import { SearchSService } from './search-s.service';

describe('SearchSService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchSService = TestBed.get(SearchSService);
    expect(service).toBeTruthy();
  });
});
