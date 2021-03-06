import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { getSearchHistory, onSearchHistoryEntry, SearchHistoryEntry } from '../search-history';
import { searchFieldLabels } from '../search-term-values';
import { eventType, prettyYearRange, eventIcon } from '../display-helpers';
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
  prettyYearRange = prettyYearRange;
  eventIcon = eventIcon;

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
          .map((filter) => Object.values(filter).join('_'))
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
