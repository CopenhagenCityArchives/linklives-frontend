import { Component, OnInit, ElementRef, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  selector: 'lls-filter-sidebar',
  templateUrl: './view.html',
  host: {
    '(blur)': 'onBlur();',
  },
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
  @Input() name: string;
  @Input() openSidebar: boolean;
  @Output() closeSidebar: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<object> = new EventEmitter<object>();

  constructor(private elRef: ElementRef) {}

  isOpen: boolean = false;

  filterOptions: Array<Option> = [
    {
      label: "Kilder (1800)",
      value: "sources_1800"
    },
    {
      label: "Kilder (1850)",
      value: "sources_1850"
    },
    {
      label: "Kilder (1900)",
      value: "sources_1900"
    },
  ]

  open() {
    this.openSidebar = true;
  }

  close() {
    this.closeSidebar.emit(null);
  }

  addFilter(option: Option) {
    this.change.emit(option);
  }

  ngOnInit(): void {

  }

}
