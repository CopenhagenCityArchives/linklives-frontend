import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Link } from '../elasticsearch/elasticsearch.service';
import { prettyDate } from '../display-helpers';
import { PersonAppearance } from '../search/search.service';
import { getLatestSearchQuery } from '../search-history';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';

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
  currentLinkKey: string = "";
  totalRatings;
  ratingCountByCategory;

  get pasReversed() {
    return [ ...this.pas ].reverse();
  }

  get aboutLifeCourseText() {
    return this.config.aboutLifeCourseText;
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
        key: link.key,
      };
    });
  }

  get personAppearancesSortedByYear() {
    const sortedByYear = this.pas.sort(function(a, b) {
      if (a.event_year_display > b.event_year_display) {
        return 1;
      }
      if (a.event_year_display < b.event_year_display) {
        return -1;
      }
      return 0;
    });
    return sortedByYear;
  }

  get latestPersonAppearance() {
    return this.personAppearancesSortedByYear[this.personAppearancesSortedByYear.length - 1];
  }

  get personName() {
    return this.latestPersonAppearance.name_display;
  }

  get birthPlace() {
    const firstPaWithBirthPlace = this.personAppearancesSortedByYear.find((pa) => pa.birthplace_display);
    return firstPaWithBirthPlace ? firstPaWithBirthPlace.birthplace_display : "";
  }

  get birthYear() {
    const firstPaWithBirthYear = this.personAppearancesSortedByYear.find((pa) => pa.birthyear_display);
    return firstPaWithBirthYear ? firstPaWithBirthYear.birthyear_display : "";
  }

  get deathYear() {
    return this.latestPersonAppearance.deathyear_display || "";
  }

  get lastUpdated() {
    const dates = this.pas
      .map((pa) => pa.last_updated_wp4)
      .sort();
    const date = dates[dates.length - 1];

    return prettyDate(date);
  }

  openLinkRating(linkKey) {
    this.currentLinkKey = linkKey;
    this.elasticsearch.getLinkRatingStats(linkKey).subscribe(linkRatingData => {
      this.totalRatings = linkRatingData.totalRatings
      this.ratingCountByCategory = linkRatingData.headingRatings;
    });
  }

  constructor(private route: ActivatedRoute, private elasticsearch: ElasticsearchService) { }

  ngOnInit(): void {
    this.route.data.subscribe(next => {
      this.pas = next.lifecourse.personAppearances as PersonAppearance[];
      this.lifecourseId = next.lifecourse.lifecourseId;
      this.links = next.lifecourse.links;
    });
  }

}
