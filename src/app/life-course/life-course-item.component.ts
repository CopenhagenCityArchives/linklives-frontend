import { Component, OnInit, Input } from '@angular/core';
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
    const sortedYears = this.personAppearances.map(pa => pa.source_year).sort();
    return `${sortedYears[0]} - ${sortedYears[sortedYears.length - 1]}`;
  }

  get sourceList() {
    const sources = this.personAppearances.map(pa => `Folketælling ${pa.source_year}`);
    const formattedSources = sources.join(", ");
    return formattedSources;
  }

  get birthLocation() {
    const location = [
      ...new Set(
        [
          this.latestPersonAppearance.parish,
          this.latestPersonAppearance.district,
          this.latestPersonAppearance.county,
          this.latestPersonAppearance.birth_place_koebstad,
          this.latestPersonAppearance.birth_place_town,
          this.latestPersonAppearance.birth_place_place,
          this.latestPersonAppearance.birth_place_island,
          this.latestPersonAppearance.birth_place_other,
        ].filter((x) => x)
      )
    ].join(", ");
    return location || this.latestPersonAppearance.birth_place_clean;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
