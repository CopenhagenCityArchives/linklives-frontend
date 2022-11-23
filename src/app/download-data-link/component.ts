import { Component, OnInit, Input } from '@angular/core';
import { prettyNumbers } from '../util/display-helpers';
import { UserManagementService } from '../user-management/service';
import { DownloadService } from '../data/download.service';

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
  sourceCount: number = 0; // PLACEHOLDER. TODO: Should get from length of data-list.
  user;
  downloadFormats: Array<object> = [
    {
      label: "csv",
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
    if(
      this.user &&
      this.data.estimated_results <= this.sourceDownloadLimit &&
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

  saveFile(data, format) {
    const formatUrl = {
      csv: `data:text/csv;charset=utf-8,${encodeURI(data)}`,
      xlsx: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8,${encodeURI(data)}`,
    }

    const hiddenElement = document.createElement('a');
    hiddenElement.target = '_blank';
    hiddenElement.href = formatUrl[format];
    //provide the name for the CSV file to be downloaded
    hiddenElement.download = `${this.data.id}.${format}`;
    hiddenElement.click();
  }

  downloadData() {
    this.downloadService.sendDownloadRequest(this.chosenDownloadFormat, this.data.type, this.data.id, this.data.query)
      .subscribe(results => this.saveFile(results, this.chosenDownloadFormat));
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.userManagement.getUser();
  }

  constructor(
    public userManagement: UserManagementService,
    private downloadService: DownloadService,
  ) {}
}
