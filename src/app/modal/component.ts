import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './component.html',
})
export class ModalComponent {
  @Input() featherIconPath: string;
  @Input() title: string;
  @Input() show: boolean;

  @Output()
  close: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}
}
