import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeCourseComponent } from './life-course.component';
import { PersonAppearance } from '../search/search.service';
import { ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { PersonAppearanceItemComponent } from '../person-appearance/person-appearance-item.component';

describe('LifeCourseComponent', () => {
  let component: LifeCourseComponent;
  let fixture: ComponentFixture<LifeCourseComponent>;
  let compiled: Element;
  let routeStub: { data: Observable<{ lifecourse: { lifecourseId: number, personAppearances: PersonAppearance[] } }> } = { data: undefined };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeCourseComponent, PersonAppearanceItemComponent ],
      providers: [ { provide: ActivatedRoute, useValue: routeStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeCourseComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
  });

  xit('should store the resolved data', () => {
    let pas: PersonAppearance[] = [];
    routeStub.data = of({ lifecourse: { personAppearances: pas, lifecourseId: 1 } });
    fixture.detectChanges();

    expect(component.pas).toEqual(pas);
  });
});
