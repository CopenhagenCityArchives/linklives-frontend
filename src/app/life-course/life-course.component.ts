import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { prettyBirthLocation, prettyBirthYear } from '../display-helpers';
import { PersonAppearance } from '../search/search.service';
import { getLatestSearchQuery } from '../search-history';

@Component({
  selector: 'app-life-course',
  templateUrl: './life-course.component.html',
  styleUrls: ['./life-course.component.scss']
})
export class LifeCourseComponent implements OnInit {

  pas: PersonAppearance[] = [];
  // TODO: This ID seems to be just "1" all the time. Fix it.
  lifecourseId: number;
  getLatestSearchQuery = getLatestSearchQuery;

  get config() {
    return window["lls"];
  }

  featherSpriteUrl = this.config.featherIconPath;
  openSearchHistory: boolean = false;

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
    return prettyBirthLocation(this.latestPersonAppearance);
  }

  get birthYear() {
    return prettyBirthYear(this.latestPersonAppearance);
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
