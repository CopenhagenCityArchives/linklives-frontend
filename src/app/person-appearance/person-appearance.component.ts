import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonAppearance } from '../search/search.service';
import { eventType, prettyDate, prettySourceLocation } from '../display-helpers';
import { getLatestSearchQuery } from '../search-history';

@Component({
  selector: 'app-person-appearance',
  templateUrl: './person-appearance.component.html',
})
export class PersonAppearanceComponent implements OnInit {
  featherSpriteUrl = window["lls"].featherIconPath;
  openSearchHistory: boolean = false;
  getLatestSearchQuery = getLatestSearchQuery;

  constructor(private route: ActivatedRoute) { }
  pa: PersonAppearance;
  hh: PersonAppearance[];

  get eventType() {
    return eventType(this.pa);
  }

  get sourceLocation() {
    return prettySourceLocation(this.pa);
  }

  get prettyLastUpdatedDate() {
    return prettyDate(this.pa.last_updated);
  }

  get relatedPersonsTitle() {
    if(this.pa.event_type === "census") {
      return "Husstand";
    }
    return "Relaterede personer";
  }

  ngOnInit(): void {
    this.route.data.subscribe((resolve) => {
      this.pa = resolve.item.pa as PersonAppearance;
      this.hh = resolve.item.hh as PersonAppearance[];
    });
  }

}
