import { Component, OnInit, ElementRef, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { eventIcon, eventType } from '../display-helpers';

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
})

export class FilterSidebar implements OnInit {
  @Input() featherIconPath: string;
  @Input() possibleSources: Array<{ source_year: number, event_type: string }>;
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
  sidebarCategoryOpen: String = undefined;
  filtersCategories = { burials: [], census: [] };
  _filters: number[] = [];
  onChange: Function = () => {};
  onTouched: Function = () => {};

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
    return this.filters.some((filterValue) => filterValue === optionValue)
  }

  toggleCategory(type) {
    this.sidebarCategoryOpen = type;
  }

  ngOnInit(): void {
    this.possibleSources.forEach(x => {
      console.warn("source", x);
      const prettyEventType = eventType({ event_type: x.event_type });
      const filter =  {
        label: `${prettyEventType} ${x.source_year}`,
        type: prettyEventType,
        icon: eventIcon(x.event_type),
        value: `${x.event_type}_${x.source_year}`,
        chosen: false,
      };
      if(x.event_type === "burial") {
        this.filtersCategories.burials.push(filter);
      }
      if(x.event_type === "census") {
        this.filtersCategories.census.push(filter);
      }
    });
  }

}
