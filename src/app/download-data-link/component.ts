import { Component, OnInit, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { EventTypeBucket, SimpleBucket, SourceBucket } from '../data/data.service';
import { prettyNumbers, filterTitle, filterTypes, yearFilterTypes } from '../util/display-helpers';

@Component({
  selector: 'lls-download-link',
  templateUrl: './view.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DownloadDataLink),
      multi: true
    },
  ],
  host: {
    '(document:keyup.escape)': 'closeOnEsc()'
  }
})

export class DownloadDataLink implements OnInit {
  @Input() featherIconPath: string;
  @Input() cssClass: string

  openModal: boolean = false;
  allowedDownloadData: boolean = false;
  sourceDownloadLimit: number = 10000; // placeholder number

  ngOnInit(): void {}

  toggleModal(showModal: boolean, $event) {
    $event.preventDefault();
    this.openModal = true;
  }

  closeOnEsc() {
    // Close modal on escape keypress
    if(this.openModal) {
      this.openModal = false;
    }
  }
}
