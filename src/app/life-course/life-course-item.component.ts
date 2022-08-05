import { Component, Input, OnChanges } from '@angular/core';
import { prettyYearRange } from '../util/display-helpers';
import { PersonAppearance } from '../data/data.service';

@Component({
  selector: 'app-life-course-item',
  templateUrl: './life-course-item.component.html',
})
export class LifeCourseItemComponent implements OnChanges {

  @Input('item') _pas: PersonAppearance[];
  @Input('lifecourse-key') lifecourseKey: string;

  personAppearances: PersonAppearance[] = [];

  get config() {
    return window["lls"];
  }

  featherSpriteUrl = this.config.featherIconPath;

  get latestPersonAppearance() {
    return this.personAppearances[this.personAppearances.length - 1];
  }

  get sourceYearRange() {
    return prettyYearRange(this.personAppearances);
  }

  get sourceList() {
    const sources = this.personAppearances.map(pa => `${pa.source_type_display} ${pa.sourceyear_display}`);
    const formattedSources = sources.join(", ");
    return formattedSources;
  }

  get birthPlace() {
    return this.latestPersonAppearance.birthplace_display || "";
  }

  get birthYear() {
    return this.latestPersonAppearance.birthyear_display || "";
  }

  get deathYear() {
    return this.latestPersonAppearance.deathyear_display || "";
  }

  get personName() {
    return this.latestPersonAppearance.name_display || "";
  }

  constructor() { }

  ngOnChanges(): void {
    this.personAppearances = [ ...this._pas ].sort(function(a, b) {
      if (a.event_year_display > b.event_year_display) {
        return 1;
      }
      if (a.event_year_display < b.event_year_display) {
        return -1;
      }
      return 0;
    });
  }
}
