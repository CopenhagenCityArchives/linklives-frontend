import { Component, OnInit, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { EventTypeFilterIdentifier, SourceFilterIdentifier } from '../search/search.service';
import { prettyNumbers, filterTitle, filterTypes, yearFilterTypes } from '../util/display-helpers';

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  selector: 'lls-filter-sidebar',
  templateUrl: './view.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilterSidebar),
      multi: true
    },
  ],
  host: {
    '(document:keyup.escape)': 'closeOnEsc()'
  }
})

export class FilterSidebar implements OnInit {
  @Input() featherIconPath: string;
  @Input() possibleFilters: {
    eventType: Array<EventTypeFilterIdentifier & { count: number }>,
    source: Array<SourceFilterIdentifier & { count: number }>,
    eventYear: Array<{ key: number, count: number }>,
    birthYear: Array<{ key: number, count: number }>,
    deathYear: Array<{ key: number, count: number }>,
  };
  @Input() openSidebar: boolean;
  @Input()
  get filters() {
    return this._filters;
  }
  set filters(filters: number[]) {
    this._filters = filters;
  }

  @Output() closeSidebar: EventEmitter<any> = new EventEmitter();
  @Output() removeFilter: EventEmitter<any> = new EventEmitter();
  filterTypes = filterTypes;
  yearFilterTypes = yearFilterTypes;
  filterTitle = filterTitle;

  // Start ControlValueAccessor
  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  writeValue(filters: number[]) {
    this.filters = filters ? [...filters] : [];
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }
  // End ControlValueAccessor

  filtersWithLabels = [];
  sidebarCategoryOpen: {
    source: Boolean,
    eventType: Boolean,
    year: Boolean,
  } = {
    source: false,
    eventType: false,
    year: false,
  };
  yearCategoryOpen = false;

  _filters: number[] = [];
  onChange: Function = () => {};
  onTouched: Function = () => {};

  sourceCategories() {
    return this.possibleFilters.source.map(x => {
      return {
        label: x.source_type_display,
        type: x.source_type_wp4,
        value: `source_${x.source_type_wp4}_${x.source_type_display}`,
        count: prettyNumbers(x.count),
        chosen: false,
      };
    });
  }

  eventCategories() {
    return this.possibleFilters.eventType.map(x => {
      return {
        label: x.event_type_display,
        type: x.event_type,
        value: `eventType_${x.event_type}_${x.event_type_display}`,
        count: prettyNumbers(x.count),
        chosen: false,
      };
    });
  }

  histogramOptions(filterType) {
    return this.possibleFilters[filterType]
      .filter(x => x.count > 0)
      .map(x => {
        return {
          label: `${x.key} – ${x.key + 9}`,
          type: x.key,
          value: `${filterType}_${x.key}`,
          count: prettyNumbers(x.count),
          chosen: false,
        };
      });
  }

  filtersCategories(filterType) {
    if(filterType == 'eventType') {
      return this.eventCategories();
    }
    if(filterType == 'source') {
      return this.sourceCategories();
    }
    if(filterType.endsWith('Year')) {
      return this.histogramOptions(filterType);
    }
  }

  close() {
    this.onChange([...this.filters]);
    this.onTouched();
    this.closeSidebar.emit(null);
  }

  addFilter(option) {
    if(this.filters.find(filterValue => filterValue === option.value)) {
      const elementIndex = this.filters.indexOf(option.value);
      this.filters.splice(elementIndex, 1);
      return;
    }

    this.filters.push(option.value);
  }

  activeFilter(optionValue) {
    return this.filters.some((filterValue) => filterValue === optionValue);
  }

  toggleCategory(filterType) {
    this.sidebarCategoryOpen[filterType] = !this.sidebarCategoryOpen[filterType];
  }

  closeOnEsc() {
    // Close sidebar on escape keypress
    if(this.openSidebar) {
      this.close();
    }
  }

  ngOnInit(): void {}
}
