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

  get sourceYearRange() {
    const sortedYears = this.personAppearances.map(pa => pa.source_year).sort();
    return `${sortedYears[0]} - ${sortedYears[sortedYears.length - 1]}`;
  }

  get sourceList() {
    const sources = this.personAppearances.map(pa => `Folketælling ${pa.source_year}`);
    const formattedSources = sources.join(", ");
    return formattedSources;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
