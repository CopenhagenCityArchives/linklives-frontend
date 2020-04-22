import { TestBed } from '@angular/core/testing';

import { SearchResultResolverService } from './search-result-resolver.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('SearchResultResolverService', () => {
  let service: SearchResultResolverService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SearchResultResolverService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
