import { TestBed } from '@angular/core/testing';

import { LifeCourseResolverService } from './life-course-resolver.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ElasticsearchService } from './elasticsearch/elasticsearch.service';

describe('LifeCourseResolverService', () => {
  let service: LifeCourseResolverService;
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
    service = TestBed.inject(LifeCourseResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
