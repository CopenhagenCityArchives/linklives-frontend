import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lls-boolean',
  templateUrl: './view.html',
  host: {
    'tabindex': '0',
    '(click)': 'toggleValue()',
    '(keydown)': 'onKeyPress($event)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Boolean),
      multi: true
    },
  ],
})
export class Boolean implements ControlValueAccessor {
  @Input() featherIconPath: string;
  @Input() iconTrue: string;
  @Input() iconFalse: string;

  @Input()
  get value() {
    return this._value;
  }
  set value(value: boolean) {
    this._value = value;
    this.onChange(value);
    this.change.emit(value);
    this.onTouched();
  }

  _value: boolean = false;

  onChange: Function = () => {};
  onTouched: Function = () => {};

  @Output() ngModelChange = new EventEmitter<boolean>();
  @Output() change = new EventEmitter<boolean>();

  constructor() {}

  // Start ControlValueAccessor
  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  writeValue(value: boolean) {
    this.value = value;
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }
  // End ControlValueAccessor

  toggleValue() {
    this.value = !this.value;
  }

  onKeyPress($event) {
    const handler = {
      Enter: () => this.toggleValue(),
    }[$event.code];

    if(handler) {
      $event.stopPropagation();
      $event.preventDefault();
      handler();
    }
  }
}
