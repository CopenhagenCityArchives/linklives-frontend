import { TestBed } from '@angular/core/testing';

import { PersonAppearanceResolverService } from './person-appearance-resolver.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('PersonAppearanceResolverService', () => {
  let service: PersonAppearanceResolverService;
  let elasticsearchServiceStub = {
    doc: jasmine.createSpy('doc')
  }
  let activatedRouteSnapshotStub = {
    params: {},
    data: {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ElasticsearchService, useValue: elasticsearchServiceStub },
        { provide: ActivatedRouteSnapshot, useValue: activatedRouteSnapshotStub }
      ]
    });
    service = TestBed.inject(PersonAppearanceResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
