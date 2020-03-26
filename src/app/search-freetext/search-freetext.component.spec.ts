import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFreetextComponent } from './search-freetext.component';

describe('SearchFreetextComponent', () => {
  let component: SearchFreetextComponent;
  let fixture: ComponentFixture<SearchFreetextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFreetextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFreetextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
