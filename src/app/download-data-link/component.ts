import { Component, OnInit, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { prettyNumbers } from '../util/display-helpers';
import { UserManagementService } from '../user-management/service';

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

  prettyNumbers = prettyNumbers;

  openModal: boolean = false;
  allowedDownloadData: boolean = false;
  sourceDownloadLimit: number = 10000; // placeholder number
  user;
  downloadFormats: Array<object> = [
    {
      label: "csv",
      value: "csv",
    },
    {
      label: "Excel (xsxl)",
      value: "xsxl",
    }
  ]
  chosenDownloadFormat: string = "";
  consent1: boolean = false;
  consent2: boolean = false;

  get downloadActive() {
    if(this.user && this.chosenDownloadFormat && this.consent1 && this.consent2) {
      return true;
    }
    return false;
  }

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

  async ngOnInit(): Promise<void> {
    this.user = await this.userManagement.getUser();
    if (this.user) {
      this.allowedDownloadData = true;
    }
  }

  constructor(
    public userManagement: UserManagementService,
  ) {}
}
