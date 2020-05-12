import { TestBed } from '@angular/core/testing';

import { ItemResolverService } from './item-resolver.service';
import { ElasticsearchService } from './elasticsearch/elasticsearch.service';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('ItemResolverService', () => {
  let service: ItemResolverService;
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
    service = TestBed.inject(ItemResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
