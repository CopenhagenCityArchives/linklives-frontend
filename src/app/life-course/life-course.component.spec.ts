import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeCourseComponent } from './life-course.component';

describe('LifeCourseComponent', () => {
  let component: LifeCourseComponent;
  let fixture: ComponentFixture<LifeCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
