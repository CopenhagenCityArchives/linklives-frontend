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
  @Input() possibleYears: Array<number>;
  @Input() name: string;
  @Input() openSidebar: boolean;
  @Output() closeSidebar: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<object> = new EventEmitter<object>();

  constructor(private elRef: ElementRef) {}

  isOpen: boolean = false;

  open() {
    this.openSidebar = true;
  }

  close() {
    this.closeSidebar.emit(null);
  }

  addFilter(option) {
    this.change.emit(option);
  }

  ngOnInit(): void {

  }

}
