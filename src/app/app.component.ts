import { Component, Injectable } from '@angular/core';
import { ElasticsearchService } from './elasticsearch/elasticsearch.service';

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

  constructor(private elasticsearch: ElasticsearchService) {
    this.elasticsearch.loading.subscribe((loading) => this.loading = loading);
  }
}
