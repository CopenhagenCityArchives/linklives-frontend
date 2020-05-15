import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';

import { SimpleSearchComponent } from './search-simple.component';
import { of } from 'rxjs';
import { SearchFieldComponent } from '../search-field/search-field.component';

describe('SimpleSearchComponent', () => {
  let component: SimpleSearchComponent;
  let fixture: ComponentFixture<SimpleSearchComponent>;
  let compiled: Element;
  let routerStub = {
    navigate: jasmine.createSpy('navigate')
  }
  let activatedRouteStub = {
    get queryParamMap() { return undefined }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ SimpleSearchComponent, SearchFieldComponent ],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleSearchComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
    routerStub.navigate.calls.reset();
  });

  it('should create', () => {
    spyOnProperty(activatedRouteStub, 'queryParamMap').and.returnValue(of(convertToParamMap({})));
    fixture.detectChanges();
    expect(component).toBeDefined();
  });

  it('should have an empty query field, when there is not query param', async () => {
    spyOnProperty(activatedRouteStub, 'queryParamMap').and.returnValue(of(convertToParamMap({})));
    fixture.detectChanges();
    await fixture.whenStable();

    let input: HTMLInputElement = compiled.querySelector('input#query');
    expect(input.value).toBe('');
  });

  it('should use the query param to set the input value', async () => {
    spyOnProperty(activatedRouteStub, 'queryParamMap').and.returnValue(of(convertToParamMap({ query: 'query text'})));
    fixture.detectChanges();
    await fixture.whenStable();

    let input: HTMLInputElement = compiled.querySelector('input#query');
    expect(input.value).toBe('query text');
  });

  it('should update component query member, when text is added to input field', async () => {
    spyOnProperty(activatedRouteStub, 'queryParamMap').and.returnValue(of(convertToParamMap({})));

    fixture.detectChanges();
    await fixture.whenStable();

    let input: HTMLInputElement = compiled.querySelector('input#query');
    input.value = "query text";
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.query).toBe('query text');
  });

  describe('search()', () => {
    it('should navigate to the result page, with query param', async () => {
      spyOnProperty(activatedRouteStub, 'queryParamMap').and.returnValue(of(convertToParamMap({})));
      fixture.detectChanges();
  
      component.query = 'query text';
      component.search();
  
      expect(routerStub.navigate).toHaveBeenCalledWith(['/results'], { queryParams: { query: 'query text' }});
    });
  })
});
