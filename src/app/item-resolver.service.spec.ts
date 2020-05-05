import { TestBed } from '@angular/core/testing';

import { ItemResolverService } from './item-resolver.service';

describe('ItemResolverService', () => {
  let service: ItemResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
