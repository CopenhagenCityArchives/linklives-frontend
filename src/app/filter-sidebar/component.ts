import { Component, OnInit, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { eventIcon, sourceIcon, eventType, prettyNumbers } from '../display-helpers';

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
    eventType: Array<{ event_year_display: string, event_type: string, event_type_display: string, count: number }>,
    source: Array<{ source_year_display: string, source_type_wp4: string, source_type_display: string, count: number }>
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
  eventIcon = eventIcon;
  sourceIcon = sourceIcon;
  eventType = eventType;

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
    source: String,
    eventType: String,
  } = {
    source: "",
    eventType: "",
  };

  _filters: number[] = [];
  onChange: Function = () => {};
  onTouched: Function = () => {};

  sourceCategories(filterType) {
    const result = {};
    this.possibleFilters[filterType].forEach(x => {
      const filter =  {
        label: `${x.source_type_display} ${x.source_year_display}`,
        type: x.source_type_wp4,
        icon: sourceIcon(x.source_type_wp4),
        value: `${filterType}_${x.source_type_wp4}_${x.source_type_display}_${x.source_year_display}`,
        count: prettyNumbers(x.count),
        chosen: false,
      };
      if(!result[x.source_type_wp4]) {
        result[x.source_type_wp4] = {
          display: x.source_type_display,
          filters: [],
        }
      }
      result[x.source_type_wp4].filters.push(filter);
    });
    return result;
  }

  eventCategories(filterType) {
    const result = {};
    this.possibleFilters[filterType].forEach(x => {
      const filter =  {
        label: `${x.event_type_display} ${x.event_year_display}`,
        type: x.event_type,
        icon: eventIcon(x.event_type),
        value: `${filterType}_${x.event_type}_${x.event_type_display}_${x.event_year_display}`,
        count: prettyNumbers(x.count),
        chosen: false,
      };
      if(!result[x.event_type]) {
        result[x.event_type] = {
          display: x.event_type_display,
          filters: [],
        }
      }
      result[x.event_type].filters.push(filter);
    });
    return result;
  }

  filtersCategories(filterType) {
    if(filterType == 'eventType') {
      return this.eventCategories(filterType);
    }
    if(filterType == 'source') {
      return this.sourceCategories(filterType);
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

  toggleCategory(filter, type) {
    this.sidebarCategoryOpen[filter] = type;
  }

  closeOnEsc() {
    // Close sidebar on escape keypress
    if(this.openSidebar) {
      this.close();
    }
  }

  ngOnInit(): void {}

}
