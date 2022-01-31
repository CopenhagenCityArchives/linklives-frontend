import { Component, Injectable } from '@angular/core';
import { DataService } from './data/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
@Injectable({
  providedIn: 'root'
})
export class AppComponent {
  title = 'linklives';
  loading = false;

  constructor(private elasticsearch: DataService) {
    this.elasticsearch.loading.subscribe((loading) => this.loading = loading);
  }
}
