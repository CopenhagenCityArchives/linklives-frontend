import { Component, OnInit, Input } from '@angular/core';
import { prettyNumbers } from '../util/display-helpers';
import { UserManagementService } from '../user-management/service';
import { DownloadService } from '../data/download.service';

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
  @Input() paKey?: string;

  prettyNumbers = prettyNumbers;

  openModal: boolean = false;
  sourceDownloadLimit: number = 500;
  minimumSearchQueryFields: number = 2;
  searchQueryFields: number = 2; // PLACEHOLDER. TODO: Should get from search data.
  sourceCount: number = 0; // PLACEHOLDER. TODO: Should get from length of data-list.
  sourceData: object = { "k": 9 };
  user;
  downloadFormats: Array<object> = [
    {
      label: "csv",
      value: "csv",
    },
    {
      label: "Excel (xlxs)",
      value: "xlxs",
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

  downloadData() {
    this.downloadService.sendDownloadRequest(this.chosenDownloadFormat, this.sourceData, this.paKey).subscribe({
      error: (e) => {
        if(e.message.match(/Login required/i)) {
          this.userManagement.handleLogin();
          return;
        }
        throw e;
      },
      complete: () => {
        console.log("SUCCESS")
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.userManagement.getUser();
  }

  constructor(
    public userManagement: UserManagementService,
    private downloadService: DownloadService,
  ) {}
}
