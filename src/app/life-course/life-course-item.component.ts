import { Component, OnInit, Input } from '@angular/core';
import { prettyBirthLocation, prettyBirthYear, prettyDeathYear, prettyFullName, prettyYearRange } from '../display-helpers';
import { PersonAppearance } from '../search/search.service';

@Component({
  selector: 'app-life-course-item',
  templateUrl: './life-course-item.component.html',
  styleUrls: ['./life-course-item.component.scss']
})
export class LifeCourseItemComponent implements OnInit {

  @Input('item') personAppearances: PersonAppearance[];
  @Input('lifecourse-id') lifecourseId: number;

  get config() {
    return window["lls"];
  }

  featherSpriteUrl = this.config.featherIconPath;

  get latestPersonAppearance() {
    const sortedByYear = this.personAppearances.sort(function(a, b) {
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

  get sourceYearRange() {
    return prettyYearRange(this.personAppearances);
  }

  get sourceList() {
    const eventNamesByType = {
      "census": "Folke&shy;tælling",
      "burial": "Begravelse",
    };
    const sources = this.personAppearances.map(pa => `${eventNamesByType[pa.event_type]} ${pa.source_year}`);
    const formattedSources = sources.join(", ");
    return formattedSources;
  }

  get birthLocation() {
    return prettyBirthLocation(this.latestPersonAppearance);
  }

  get birthYear() {
    return prettyBirthYear(this.latestPersonAppearance);
  }

  get deathYear() {
    return prettyDeathYear(this.latestPersonAppearance);
  }

  get personName() {
    return prettyFullName(this.latestPersonAppearance);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
