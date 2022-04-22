import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { getSearchHistory, onSearchHistoryEntry, SearchHistoryEntry, SearchHistoryEntryType } from '../search-history';
import { searchFieldLabels } from '../search-term-values';
import { prettyYearRange, eventIcon } from '../util/display-helpers';

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

  searchHistory: SearchHistoryEntry[] = getSearchHistory()
    .map((entry) => {
      if(entry.type != SearchHistoryEntryType.SearchResult) {
        return entry;
      }

      if(Object.keys(entry.query).length == 0) {
        entry.query.query = "";
      }
      return entry;
    });

  searchFieldLabels = searchFieldLabels;
  prettyYearRange = prettyYearRange;
  eventIcon = eventIcon;

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

    if(entry.filters) {
      queryParams = {
        ...queryParams,
        sourceFilter: entry.filters
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
    onSearchHistoryEntry((history) => {
      this.searchHistory = history
        .map((entry) => {
          if(entry.type != SearchHistoryEntryType.SearchResult) {
            return entry;
          }

          if(Object.keys(entry.query).length == 0) {
            entry.query.query = "";
          }
          return entry;
        });
    });
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
