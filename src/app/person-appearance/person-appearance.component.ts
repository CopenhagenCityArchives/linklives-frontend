import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonAppearance } from '../search/search.service';
import { eventType, prettyDate, prettySourceLocation } from '../display-helpers';
import { getLatestSearchQuery, getSearchHistory, SearchHistoryEntryType } from '../search-history';

@Component({
  selector: 'app-person-appearance',
  templateUrl: './person-appearance.component.html',
})
export class PersonAppearanceComponent implements OnInit {
  featherSpriteUrl = window["lls"].featherIconPath;
  openSearchHistory: boolean = false;
  getLatestSearchQuery = getLatestSearchQuery;

  constructor(private route: ActivatedRoute) { }
  pa: PersonAppearance;
  hh: PersonAppearance[];

  get eventType() {
    return eventType(this.pa);
  }

  get sourceLocation() {
    return prettySourceLocation(this.pa);
  }

  get prettyLastUpdatedDate() {
    return prettyDate(this.pa.last_updated);
  }

  get previousSearchHistoryEntry() {
    return getSearchHistory()[1];
  }

  previousSearchHistoryEntryIsConnectedLifecourse() {
    const entry = this.previousSearchHistoryEntry;

    if(entry.type !== SearchHistoryEntryType.Lifecourse) {
      return false;
    }

    return entry.lifecourse.personAppearances.some((pa) => pa.id === this.pa.id);
  }

  ngOnInit(): void {
    this.route.data.subscribe((resolve) => {
      this.pa = resolve.item.pa as PersonAppearance;
      this.hh = resolve.item.hh as PersonAppearance[];
    });
  }

}
