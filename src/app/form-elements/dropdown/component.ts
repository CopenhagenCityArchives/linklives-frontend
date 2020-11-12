import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface Option {
  label: string;
  value: string;
}

@Component({
  selector: 'lls-dropdown',
  templateUrl: './view.html',
  host: {
    'tabindex': '0',
    '(click)': 'toggleOpen()',
    '(blur)': 'close();',
    '(keydown)': 'onKeyPress($event)',
  },
})
export class Dropdown implements OnInit {
  @Input() featherIconPath: string;
  @Input() name: string;
  @Input() value: string;
  @Input() options: Array<Option>;

  currentValue: string;
  isOpen: boolean = false;
  tabHovered?: number = null;

  get currentLabel() {
    return this.options.find((opt) => opt.value == this.currentValue).label;
  }

  @Output() ngModelChange = new EventEmitter<string>();

  constructor(private hostElement: ElementRef) {}

  ngOnInit(): void {
    this.currentValue = this.value;
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.tabHovered = null;
  }

  select(option: Option) {
    this.currentValue = option.value;
    this.close();
  }

  onKeyPress($event) {
    const handler = {
      ArrowDown: () => this.tabHoverNextItem(),
      ArrowUp: () => this.tabHoverPreviousItem(),
      Enter: () => this.selectTabHoveredItemOrToggleOpen(),
      Escape: () => this.close(),
    }[$event.code];

    if(handler) {
      $event.stopPropagation();
      $event.preventDefault();
      handler();
    }
  }

  tabHoverNextItem() {
    if(this.tabHovered === null) {
      this.tabHovered = 0;
      return;
    }
    if(this.tabHovered < this.options.length - 1) {
      this.tabHovered++;
    }
  }

  tabHoverPreviousItem() {
    if(this.tabHovered === null) {
      return;
    }
    if(this.tabHovered > 0) {
      this.tabHovered--;
    }
  }

  selectTabHoveredItemOrToggleOpen() {
    if(this.tabHovered === null) {
      if(!this.isOpen) {
        this.open();
        this.tabHovered = this.options.findIndex((opt) => opt.value === this.currentValue);
      }
      else {
        this.close();
      }
      return;
    }
    this.select(this.options[this.tabHovered]);
    this.tabHovered = null;
  }
}
