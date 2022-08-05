import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonAppearance } from '../data/data.service';

@Component({
  selector: 'app-related-people',
  templateUrl: './related-people.component.html',
})
export class RelatedPeopleComponent implements OnInit {
  featherSpriteUrl = window["lls"].featherIconPath;

  constructor(private route: ActivatedRoute, private router: Router) { }

  relatedPas: Array<PersonAppearance>;
  currentPa: PersonAppearance;

  ngOnInit(): void {
    this.route.parent.data.subscribe((resolve) => {
      if(!resolve.item.hh) {
        this.router.navigate([ "pa", resolve.item.pa.key, "source-data" ]);
        return;
      }
      this.relatedPas = this.sortBy(resolve.item.hh, "pa_grouping_id_wp4_sortable") as PersonAppearance[];
      this.currentPa = resolve.item.pa;
    });
  }

  sortBy(list, key: string) {
    return list.sort((a, b) => {
      if(a[key] < b[key]) {
        return -1;
      }
      if(a[key] > b[key]) {
        return 1;
      }
      return 0;
    })
  }
}
