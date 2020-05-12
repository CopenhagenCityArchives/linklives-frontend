import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonAppearance } from '../search/search.service';

@Component({
  selector: 'app-life-course',
  templateUrl: './life-course.component.html',
  styleUrls: ['./life-course.component.scss']
})
export class LifeCourseComponent implements OnInit {

  pas: PersonAppearance[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(next => {
      this.pas = next.pas as PersonAppearance[];
    });
  }

}
