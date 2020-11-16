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
  lifecourseId: number;

  get latestPersonAppearance() {
    const sortedByYear = this.pas.sort(function(a, b) {
      if (a.source_year > b.source_year) {
        return 1;
      }
      if (a.source_year < b.source_year) {
        return -1;
      }
      return 0;
    });
    return sortedByYear[sortedByYear.length - 1];
  }

  get sourceLocation() {
    return [
      ...new Set(
        [
          this.latestPersonAppearance.parish,
          this.latestPersonAppearance.district,
          this.latestPersonAppearance.county
        ].filter((x) => x)
      )
    ].join(", ");
  }

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(next => {
      console.log(next)
      this.pas = next.lifecourse.personAppearances as PersonAppearance[];
      this.lifecourseId = next.lifecourse.lifecourseId;
    });
  }

}
