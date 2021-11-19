import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonAppearance, Source } from '../search/search.service';

@Component({
  selector: 'app-source-data',
  templateUrl: './source-data.component.html',
})
export class SourceDataComponent implements OnInit {
  featherSpriteUrl = window["lls"].featherIconPath;

  constructor(private route: ActivatedRoute) { }

  pa: PersonAppearance;
  source: Source;

  get standardizedDataLines() {
    return Object.keys(this.pa.standard)
      .map((key) => ({
        label: key.replace(/_/g, "_​"),
        value: this.cleanValue(this.pa.standard[key])
      }));
  }

  get originalDataLines() {
    return Object.keys(this.pa.transcribed)
      .map((key) => ({
        label: key,
        value: this.cleanValue(this.pa[key])
      }));
  }

  cleanValue(value) {
    if(Array.isArray(value)) {
      return value.join(", ");
    }
    return value;
  }

  isFirstInColumn(i: number, list: any[]) {
    return i == 0 || i == Math.ceil(list.length / 2) || undefined;
  }

  getColumnClass(i: number, list: any[]) {
    return i < list.length / 2 ? 'data-section__row--column-1' : 'data-section__row--column-2';
  }

  get eventTypeClass() {
    const eventType = this.pa.standard.event_type;
    if(eventType !== 'burial') {
      return eventType;
    }
    if(this.pa.source_type_wp4 === 'parish') {
      return `${eventType}-pr`
    }
    return `${eventType}-cph`
  }

  ngOnInit(): void {
    this.route.parent.data.subscribe((resolve) => {
      this.pa = resolve.item.pa as PersonAppearance;
      this.source = resolve.item.pa.source;
    });
  }

}
