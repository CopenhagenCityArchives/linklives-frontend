import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonAppearance } from '../search/search.service';

@Component({
  selector: 'app-related-people',
  templateUrl: './related-people.component.html',
})
export class RelatedPeopleComponent implements OnInit {
  featherSpriteUrl = window["lls"].featherIconPath;

  constructor(private route: ActivatedRoute, private router: Router) { }

  relatedPas: Array<PersonAppearance>;

  ngOnInit(): void {
    this.route.parent.data.subscribe((resolve) => {
      if(!resolve.item.hh) {
        this.router.navigate([ "pa", resolve.item.pa.id, "source-data" ]);
        return;
      }
      this.relatedPas = resolve.item.hh as PersonAppearance[];
    });
  }

}
