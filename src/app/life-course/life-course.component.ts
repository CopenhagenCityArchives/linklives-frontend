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
  // TODO: This ID seems to be just "1" all the time. Fix it.
  lifecourseId: number;

  get config() {
    return window["lls"];
  }

  featherSpriteUrl = this.config.featherIconPath;

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

  get birthLocation() {
    return [
      ...new Set(
        [
          this.latestPersonAppearance.birth_place_parish,
          this.latestPersonAppearance.birth_place_district,
          this.latestPersonAppearance.birth_place_county,
          this.latestPersonAppearance.birth_place_koebstad,
          this.latestPersonAppearance.birth_place_town,
          this.latestPersonAppearance.birth_place_place,
          this.latestPersonAppearance.birth_place_island,
          this.latestPersonAppearance.birth_place_other,
        ].filter((x) => x)
      )
    ].join(", ");
  }

  get lastUpdated() {
    const months = [
      "januar",
      "februar",
      "marts",
      "april",
      "maj",
      "juni",
      "juli",
      "august",
      "september",
      "oktober",
      "november",
      "december",
    ];
    const date = new Date(this.latestPersonAppearance.last_updated);
    return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
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
