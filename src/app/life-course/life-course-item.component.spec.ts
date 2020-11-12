import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeCourseItemComponent } from './life-course-item.component';
import { RouterLinkStubDirective } from 'src/testing/router-link-stub.directive';

describe('LifeCourseItemComponent', () => {
  let component: LifeCourseItemComponent;
  let fixture: ComponentFixture<LifeCourseItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeCourseItemComponent, RouterLinkStubDirective ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeCourseItemComponent);
    component = fixture.componentInstance;
  });

  xit('should create', () => {
    //TODO: needs realistic person appearances
    component.lifecourseId = 1;
    component.personAppearances = [];
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
