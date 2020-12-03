import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Link } from '../elasticsearch/elasticsearch.service';
import { prettyBirthLocation } from '../display-helpers';
import { PersonAppearance } from '../search/search.service';

@Component({
  selector: 'app-life-course',
  templateUrl: './life-course.component.html',
  styleUrls: ['./life-course.component.scss']
})
export class LifeCourseComponent implements OnInit {

  pas: PersonAppearance[] = [];
  lifecourseId: number;
  links: Link[];

  get config() {
    return window["lls"];
  }

  featherSpriteUrl = this.config.featherIconPath;
  openSearchHistory: boolean = false;

  get pasReversed() {
    return [ ...this.pas ].reverse();
  }

  get drawableLinks() {
    console.log("pas", this.pas.map((pa) => (`${pa.source_id}-${pa.pa_id}`)));
    console.log("links", this.links.map((link) => ({ a: `${link.source_id1}-${link.pa_id1}`, b: `${link.source_id2}-${link.pa_id2}` })));
    return this.links.map((link, i) => {
      const matchEitherLinkEnd = (pa: PersonAppearance) => {
        return [
          `${link.source_id1}-${link.pa_id1}`,
          `${link.source_id2}-${link.pa_id2}`
        ].includes(`${pa.source_id}-${pa.pa_id}`);
      };

      const firstIndex = this.pas.findIndex(matchEitherLinkEnd);
      const lastIndex = this.pas.length - 1 - (this.pasReversed.findIndex(matchEitherLinkEnd));
      const indexDiff = lastIndex - firstIndex;

      const tier = 0;
      return {
        path: `
          M0,0
          h${tier * 20}
          a10,10 0 0 1 10,10
          v${((196 + 27) * indexDiff) - 20}
          a10,10 0 01 -10,10
          h-${tier * 20}
        `,
        offsetY: ((196 + 27) * firstIndex + (196 / 2)),
      };
    });
  }

  get latestPersonAppearance() {
    const sortedByYear = this.pas.sort(function(a, b) {
      if (a.source_year > b.source_year) {
        return 1;
      }
      if (a.source_year < b.source_year) {
        return -1;
      }
      return 0;
    });
    return sortedByYear[sortedByYear.length - 1];
  }

  get birthLocation() {
    return prettyBirthLocation(this.latestPersonAppearance);
  }

  get lastUpdated() {
    const months = [
      "januar",
      "februar",
      "marts",
      "april",
      "maj",
      "juni",
      "juli",
      "august",
      "september",
      "oktober",
      "november",
      "december",
    ];
    const date = new Date(this.latestPersonAppearance.last_updated);
    return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(next => {
      this.pas = next.lifecourse.personAppearances as PersonAppearance[];
      this.lifecourseId = next.lifecourse.lifecourseId;
      this.links = next.lifecourse.links;
    });
  }

}
