import { Component, OnInit, Input } from '@angular/core';
import { prettyNumbers } from '../util/display-helpers';
import { UserManagementService } from '../user-management/service';
import { DownloadService } from '../data/download.service';
import { Buffer } from 'buffer';

interface inputData {
  type: string,
  id?: string,
  query?: object,
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
    if (this.data.query) {
      if (this.queryParamLength(this.data.query) < this.minimumSearchQueryFields) {
        return false;
      }
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

  queryParamLength(queryParams) {
    let filteredObj = queryParams
    Object.keys(filteredObj).forEach(key => {
      if (!filteredObj[key]) {
        delete filteredObj[key];
      }
    });
    return Object.keys(filteredObj).length;
  }

  closeOnEsc() {
    // Close modal on escape keypress
    if(this.openModal) {
      this.openModal = false;
    }
  }

  downloadData() {
    this.downloadService.sendDownloadRequest(this.chosenDownloadFormat, this.data.type, this.data.id, this.data.query)
      .subscribe(response => {
        const contentType = response.headers.get("Content-Type");
        const data = Buffer.from(response.body).toString("base64");

        let filename = `${this.data.type}.${this.chosenDownloadFormat}`;

        // Attempt to parse suggested filename from Content-Disposition header
        const contentDisposition = response.headers.get("Content-Disposition");
        if(contentDisposition) {
          const contentDispositionMatch = /filename=([^;]+);/.exec(contentDisposition);
          if(contentDispositionMatch) {
            filename = contentDispositionMatch[1];
          }
        }

        const hiddenElement = document.createElement('a');
        hiddenElement.target = '_blank';
        hiddenElement.href = `data:${contentType};base64,${data}`;
        hiddenElement.download = filename;
        hiddenElement.click();

        this.openModal = false;
      });
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.userManagement.getUser();
  }

  constructor(
    private userManagement: UserManagementService,
    private downloadService: DownloadService,
  ) {}
}
