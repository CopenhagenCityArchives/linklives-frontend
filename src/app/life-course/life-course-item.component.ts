import { Component, OnInit, Input } from '@angular/core';
import { prettyYearRange } from '../util/display-helpers';
import { PersonAppearance } from '../search/search.service';

@Component({
  selector: 'app-life-course-item',
  templateUrl: './life-course-item.component.html',
})
export class LifeCourseItemComponent implements OnInit {

  @Input('item') personAppearances: PersonAppearance[];
  @Input('lifecourse-key') lifecourseKey: string;

  get config() {
    return window["lls"];
  }

  featherSpriteUrl = this.config.featherIconPath;


  get personAppearancesSortedByYear() {
    const sortedByYear = this.personAppearances.sort(function(a, b) {
      if (a.event_year_display > b.event_year_display) {
        return 1;
      }
      if (a.event_year_display < b.event_year_display) {
        return -1;
      }
      return 0;
    });
    return sortedByYear;
  }

  get latestPersonAppearance() {
    return this.personAppearancesSortedByYear[this.personAppearancesSortedByYear.length - 1];
  }

  get sourceYearRange() {
    return prettyYearRange(this.personAppearances);
  }

  get sourceList() {
    const sources = this.personAppearances.map(pa => `${pa.source_type_display} ${pa.source_year_display}`);
    const formattedSources = sources.join(", ");
    return formattedSources;
  }

  get birthPlace() {
    const firstPaWithBirthPlace = this.personAppearancesSortedByYear.find((pa) => pa.birthplace_display);
    return firstPaWithBirthPlace ? firstPaWithBirthPlace.birthplace_display : "";
  }

  get birthYear() {
    const firstPaWithBirthYear = this.personAppearancesSortedByYear.find((pa) => pa.birthyear_display);
    return firstPaWithBirthYear ? firstPaWithBirthYear.birthyear_display : "";
  }

  get deathYear() {
    return this.latestPersonAppearance.deathyear_display || "";
  }

  get personName() {
    return this.latestPersonAppearance.name_display || "";
  }

  constructor() { }

  ngOnInit(): void {
  }
}
