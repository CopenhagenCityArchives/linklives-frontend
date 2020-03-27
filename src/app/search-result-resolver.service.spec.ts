import { TestBed } from '@angular/core/testing';

import { SearchResultResolverService } from './search-result-resolver.service';

describe('SearchResultResolverService', () => {
  let service: SearchResultResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchResultResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
