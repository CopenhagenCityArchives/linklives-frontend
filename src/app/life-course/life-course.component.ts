import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Link } from '../elasticsearch/elasticsearch.service';
import { prettyBirthLocation, prettyBirthYear, prettyDate } from '../display-helpers';
import { PersonAppearance } from '../search/search.service';
import { getLatestSearchQuery } from '../search-history';

@Component({
  selector: 'app-life-course',
  templateUrl: './life-course.component.html',
})
export class LifeCourseComponent implements OnInit {

  pas: PersonAppearance[] = [];
  lifecourseId: number;
  links: Link[];
  getLatestSearchQuery = getLatestSearchQuery;

  get config() {
    return window["lls"];
  }

  featherSpriteUrl = this.config.featherIconPath;
  openSearchHistory: boolean = false;

  get pasReversed() {
    return [ ...this.pas ].reverse();
  }

  get drawableLinks() {
    //These represent gaps, not PAs, so there is one less than there are PAs in order.
    const maxTiers = Array(this.pas.length - 1).fill(-1);

    const matchEitherLinkEnd = (link: Link) => (pa: PersonAppearance) => {
      return [
        `${link.source_id1}-${link.pa_id1}`,
        `${link.source_id2}-${link.pa_id2}`
      ].includes(`${pa.source_id}-${pa.pa_id}`);
    };

    const getIndexLength = (link: Link) => {
      const firstIndex = this.pas.findIndex(matchEitherLinkEnd(link));
      const lastIndex = this.pas.length - 1 - (this.pasReversed.findIndex(matchEitherLinkEnd(link)));
      const indexDiff = lastIndex - firstIndex;
      return { indexDiff, firstIndex, lastIndex };
    };

    const shortestLinkFirst = (a, b) => {
      const { indexDiff: aLength } = getIndexLength(a);
      const { indexDiff: bLength } = getIndexLength(b);

      if(aLength < bLength) {
        return -1;
      }
      if(aLength > bLength) {
        return 1;
      }
      return 0;
    };

    return this.links.sort(shortestLinkFirst).map((link, i) => {
      const { indexDiff, firstIndex, lastIndex } = getIndexLength(link);

      const maxTiersInRange: number[] = maxTiers.slice(firstIndex, lastIndex);
      const tier = Math.max.apply(Math, maxTiersInRange) + 1;
      maxTiers.fill(tier, firstIndex, lastIndex);

      const prettyLinkMethod = ({ method_type: method, method_subtype1: subtype }) => {
        if(method === "Manual") {
          return {
            short: "Manuelt",
            long: "Manuelt skabt link af en peson i Link-Lives teamet.",
          };
        }
        if(method === "Rule Based" && subtype === "household") {
          return {
            short: "Regel - husstandsinfo",
            long: "Regelbaseret link skabt ud fra sammenhængen mellem person og husstand.",
          };
        }
        if(method === "Rule Based") {
          return {
            short: "Regel - personinfo",
            long: "Regelbaseret link skabt ud fra personinformationer som alder, køn, navn, og fødested.",
          };
        }
        return {
          short: "Anden metode",
          long: "Der findes ingen mere præcis forklaring af metoden."
        };
      };

      return {
        path: `
          M0,0
          h${tier * 16}
          a10,10 0 0 1 10,10
          v${((196 + 27) * indexDiff) - 20}
          a10,10 0 01 -10,10
          h-${tier * 16}
        `,
        offsetY: ((196 + 27) * firstIndex + (196 / 2)),
        pathTierX: tier * 16 + 10,
        confidencePct: Math.round((1 - link.score) * 100),
        linkingMethod: prettyLinkMethod(link),
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

  get birthYear() {
    return prettyBirthYear(this.latestPersonAppearance);
  }

  get lastUpdated() {
    const dates = this.pas
      .map((pa) => pa.last_updated)
      .sort();
    const date = dates[dates.length - 1];

    return prettyDate(date);
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
