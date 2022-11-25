import { Component, OnInit, Input } from '@angular/core';
import { prettyNumbers } from '../util/display-helpers';
import { UserManagementService } from '../user-management/service';
import { DownloadService } from '../data/download.service';
import { Buffer } from 'buffer';

interface inputData {
  type: string,
  id?: string,
  query?: string,
  estimated_results: number
}

@Component({
  selector: 'lls-download-link',
  templateUrl: './view.html',
  host: {
    '(document:keyup.escape)': 'closeOnEsc()'
  }
})
export class DownloadDataLink implements OnInit {
  @Input() featherIconPath: string;
  @Input() cssClass: string;
  @Input() data: inputData;

  prettyNumbers = prettyNumbers;

  openModal: boolean = false;
  sourceDownloadLimit: number = 500;
  minimumSearchQueryFields: number = 2;
  searchQueryFields: number = 2; // PLACEHOLDER. TODO: Should get from search data.
  user;
  downloadFormats: Array<object> = [
    {
      label: "CSV",
      value: "csv",
    },
    {
      label: "Excel (xlsx)",
      value: "xlsx",
    }
  ]
  chosenDownloadFormat: string = "";
  consent1: boolean = false;
  consent2: boolean = false;

  get compliantDownloadData() {
    if (!this.user) {
      return false;
    }
    if (this.data.estimated_results > this.sourceDownloadLimit) {
      return false;
    }
    if (this.searchQueryFields < this.minimumSearchQueryFields) {
      return false;
    }
    return true;
  }

  get downloadActive() {
    if (!this.user) {
      return false;
    }
    if (!this.chosenDownloadFormat) {
      return false;
    }
    if (!this.consent1) {
      return false;
    }
    if (!this.consent2) {
      return false;
    }
    return true;
  }

  closeOnEsc() {
    // Close modal on escape keypress
    if(this.openModal) {
      this.openModal = false;
    }
  }

  saveFile(data, format) {
    const prefix = {
      csv: `data:text/csv;base64,`,
      xlsx: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,`,
    }[format];

    const hiddenElement = document.createElement('a');
    hiddenElement.target = '_blank';
    hiddenElement.href = `${prefix}${Buffer.from(data).toString("base64")}`;
    //provide the name for the CSV file to be downloaded
    hiddenElement.download = `${this.data.type}.${format}`;
    hiddenElement.click();

    this.openModal = false;
  }

  downloadData() {
    this.downloadService.sendDownloadRequest(this.chosenDownloadFormat, this.data.type, this.data.id, this.data.query)
      .subscribe(result => this.saveFile(result, this.chosenDownloadFormat));
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.userManagement.getUser();
  }

  constructor(
    private userManagement: UserManagementService,
    private downloadService: DownloadService,
  ) {}
}
