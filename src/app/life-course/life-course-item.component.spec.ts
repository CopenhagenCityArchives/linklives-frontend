import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeCourseItemComponent } from './life-course-item.component';

describe('LifeCourseItemComponent', () => {
  let component: LifeCourseItemComponent;
  let fixture: ComponentFixture<LifeCourseItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeCourseItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeCourseItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
