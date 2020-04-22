import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { SearchFieldComponent } from './search-field.component';
import { SearchService } from '../search.service';

describe('SearchFieldComponent', () => {
  let component: SearchFieldComponent;
  let fixture: ComponentFixture<SearchFieldComponent>;
  let searchMock = {
    getTypes: function() {
      return of({id: 1, name: "name", description: "description"});
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFieldComponent ],
      providers: [ { provide: SearchService, useValue: searchMock } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    component.model = { type: component.types[0], value: null };
    expect(component).toBeTruthy();
  });
});
