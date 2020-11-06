import { TestBed } from '@angular/core/testing';

import { SearchResultResolverService } from './search-result-resolver.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { SearchService } from '../search/search.service';

describe('SearchResultResolverService', () => {
  let service: SearchResultResolverService;
  let httpMock: HttpTestingController;
  let searchServiceStub = {
    simpleSearch: jasmine.createSpy('simpleSearch')
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: SearchService, useValue: searchServiceStub }
      ]
    });
    service = TestBed.inject(SearchResultResolverService);
    httpMock = TestBed.inject(HttpTestingController);
    searchServiceStub.simpleSearch.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('resolve()', () => {
    it('should call simpleSearch when `query` is set', () => {
      let route = {
        queryParamMap: convertToParamMap({ query: 'query text', index: 'pas,lifecourses' }),
        paramMap: convertToParamMap({ page: 3 })
      } as ActivatedRouteSnapshot;
      service.resolve(route, null);
      expect(searchServiceStub.simpleSearch).toHaveBeenCalledWith('query text', [ 'pas', 'lifecourses' ], 20, 10);
    });

    it('should call simpleSearch with empty string when `query` isn\'t set', () => {
      let route = {
        queryParamMap: convertToParamMap({ index: 'pas,lifecourses' }),
        paramMap: convertToParamMap({ page: 3 })
      } as ActivatedRouteSnapshot;
      service.resolve(route, null);
      expect(searchServiceStub.simpleSearch).toHaveBeenCalledWith('', [ 'pas', 'lifecourses' ], 20, 10);
    });

    it('should default to getting 10 results from offset 0', () => {
      let route = {
        queryParamMap: convertToParamMap({ query: 'query text', index: 'pas,lifecourses' }),
        paramMap: convertToParamMap({})
      } as ActivatedRouteSnapshot;
      service.resolve(route, null);
      expect(searchServiceStub.simpleSearch).toHaveBeenCalledWith('query text', [ 'pas', 'lifecourses' ], 0, 10);
    });

    it('should default `index` to \'lifecourses,pas\'', () => {
      let route = {
        queryParamMap: convertToParamMap({ query: 'query text' }),
        paramMap: convertToParamMap({ page: 3 })
      } as ActivatedRouteSnapshot;
      service.resolve(route, null);
      expect(searchServiceStub.simpleSearch).toHaveBeenCalledWith('query text', [ 'lifecourses', 'pas' ], 20, 10);
    });
  });
});
