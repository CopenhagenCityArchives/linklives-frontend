import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeCourseComponent } from './life-course.component';
import { PersonalAppearance } from '../search/search.service';

describe('LifeCourseComponent', () => {
  let component: LifeCourseComponent;
  let fixture: ComponentFixture<LifeCourseComponent>;
  let compiled: Element;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeCourseComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
  });

  it('should get data from the navigation state, when it exists', async () => {
    let pas: PersonalAppearance[] = [{
      life_course_id: 1,
      link_id: 1,
      pa_id: 1,
      method_id: 1,
      source_id: 1,
      score: 1.0,
      age: 54.0,
      age_clean: 54.0,
      birthplace: "birthplace",
      county: "county",
      county_std: "county_std",
      district: "district",
      district_std: "district_std",
      firstnames_std: "firstnames_std",
      name: "name",
      name_std: "name_std",
      name_clean: "name_clean",
      parish: "parish",
      parish_std: "parish_std",
      sex: "sex",
      sex_clean: "sex_clean",
      surnames_std: "surnames_std"
    }]
    window.history.pushState({ data: pas }, '', '');
    fixture.detectChanges();

    expect(component.pas).toEqual(pas);
  });
});
