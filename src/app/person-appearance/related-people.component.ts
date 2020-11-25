import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonAppearance } from '../search/search.service';

@Component({
  selector: 'app-related-people',
  templateUrl: './related-people.component.html',
})
export class RelatedPeopleComponent implements OnInit {
  featherSpriteUrl = window["lls"].featherIconPath;

  constructor(private route: ActivatedRoute) { }

  relatedPas: Array<PersonAppearance>;

  ngOnInit(): void {
    this.route.parent.data.subscribe((resolve) => {
      this.relatedPas = resolve.item.hh as Array<PersonAppearance>;
    });
  }

}
