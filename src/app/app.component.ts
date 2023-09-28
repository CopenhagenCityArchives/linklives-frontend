import { Component, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DataService } from './data/data.service';
import { DownloadService } from './data/download.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
@Injectable({
  providedIn: 'root'
})
export class AppComponent {
  title = 'linklives';

  get loading() {
    return this.dataLoading || this.downloadLoading;
  }
  dataLoading = false;
  downloadLoading = false;
  isAuthenticated = false;

  constructor(
    private elasticsearch: DataService,
    private downloadService: DownloadService,
    
    // AuthService must be passed in here as an argument, otherwise authentication is
    // not loaded into the entire app, and the login-completed page stops being reached
    // on login.
    // It seems that Angular tree-shakes references to AuthService away if it is not
    // referenced, so it is basically here to make sure there is a reference to it.
    private auth: AuthService,
  ) {
    this.elasticsearch.loading.subscribe((loading) => this.dataLoading = loading);
    this.downloadService.loadingEmitter.subscribe((loading) => this.downloadLoading = loading);
  }
}
