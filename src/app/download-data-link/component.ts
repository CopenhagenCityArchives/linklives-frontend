import { Component, OnInit, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { prettyNumbers } from '../util/display-helpers';
import { UserManagementService } from '../user-management/service';

@Component({
  selector: 'lls-download-link',
  templateUrl: './view.html',
  host: {
    '(document:keyup.escape)': 'closeOnEsc()'
  }
})

export class DownloadDataLink implements OnInit {
  @Input() featherIconPath: string;
  @Input() cssClass: string

  prettyNumbers = prettyNumbers;

  openModal: boolean = false;
  sourceDownloadLimit: number = 500;
  minimumSearchQueryFields: number = 2;
  searchQueryFields: number = 2; // PLACEHOLDER. TODO: Should get from search data.
  sourceCount: number = 0; // PLACEHOLDER. TODO: Should get from length of data-list.
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

  get compliantDownloadData() {
    if(
      this.user &&
      this.sourceCount <= this.sourceDownloadLimit &&
      this.searchQueryFields >= this.minimumSearchQueryFields
    ) {
      return true;
    }
    return false;
  }

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
  }

  constructor(
    public userManagement: UserManagementService,
  ) {}
}
