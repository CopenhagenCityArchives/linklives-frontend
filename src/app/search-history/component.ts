import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { getSearchHistory, onSearchHistoryEntry, SearchHistoryEntry } from '../search-history';
import { searchFieldLabels } from '../search-term-values';
import { eventType, prettyBirthLocation, prettyBirthYear, prettyYearRange, prettyFullName, eventIcon } from '../display-helpers';
import { PersonAppearance } from '../search/search.service';



@Component({
  selector: 'app-search-history',
  templateUrl: './component.html',
  host: {
    '(document:keyup.escape)': 'closeOnEsc()'
  }
})

export class SearchHistoryComponent implements OnInit {
  @Input() openSearchHistory: boolean;
  @Input() featherIconPath: string;
  @Output() close: EventEmitter<any> = new EventEmitter();
  searchHistory: SearchHistoryEntry[] = getSearchHistory();
  searchFieldLabels = searchFieldLabels;
  prettyBirthLocation = prettyBirthLocation;
  prettyBirthYear = prettyBirthYear;
  prettyYearRange = prettyYearRange;
  eventIcon = eventIcon;
  prettyFullName = prettyFullName;

  eventType(pa: PersonAppearance) {
    return eventType(pa);
  }

  queryKeys(entry) {
    return Object.keys(entry.query);
  }

  queryParams(entry) {
    let queryParams = { ...entry.query };

    if(entry.pagination) {
      const { page: pg, size } = entry.pagination;
      queryParams = { ...queryParams, pg, size };
    }

    if(entry.sort) {
      queryParams = { ...queryParams, ...entry.sort };
    }

    if(entry.sourceFilter) {
      queryParams = {
        ...queryParams,
        sourceFilter: entry.sourceFilter
          .map(({ event_type, source_year }) => `${event_type}_${source_year}`)
          .join(",")
      };
    }

    if(entry.mode) {
      queryParams.mode = entry.mode;
    }

    if(Array.isArray(entry.index)) {
      queryParams.index = entry.index.join(",");
    }

    return queryParams;
  }

  ngOnInit(): void {
    onSearchHistoryEntry((history) => this.searchHistory = history);
  }

  closeSearchHistory() {
    this.close.emit(null);
  }

  closeOnEsc() {
    // Close sidebar on escape keypress
    if(this.openSearchHistory) {
      this.closeSearchHistory();
    }
  }
}
