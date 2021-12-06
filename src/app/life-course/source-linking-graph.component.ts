import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Link } from '../elasticsearch/elasticsearch.service';
import { PersonAppearance } from '../search/search.service';

@Component({
  selector: 'app-source-linking-graph',
  templateUrl: './source-linking-graph.component.html',
})
export class SourceLinkingGraphComponent implements OnInit {

  @Input() pas: PersonAppearance[] = [];
  @Input() links: Link[] = [];

  @Output()
  openLinkRating: EventEmitter<string> = new EventEmitter<string>();

  drawableLinks: {
    offsetY: number,
    pathTierX: number,
    lineHeight: number,
    confidencePct: number,
    linkingMethod: { long: string, short: string },
    totalRatings: number,
    key: string,
    duplicates: number,
  }[] = [];

  hoveredLink?: string = null;
  hoveredTooltip?: string = null;

  get activeLink() {
    return this.hoveredLink || this.hoveredTooltip;
  }

  get pasReversed() {
    return [ ...this.pas ].reverse();
  }

  calculateDrawableLinks() {
    //These represent gaps, not PAs, so there is one less than there are PAs in order.
    const maxTiers = Array(this.pas.length - 1).fill(-1);

    const matchEitherLinkEnd = (link: Link) => (pa: PersonAppearance) => {
      return [
        `${link.source_id1}-${link.pa_id1}`,
        `${link.source_id2}-${link.pa_id2}`
      ].includes(pa.key);
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

    return this.links
      .sort(shortestLinkFirst)
      .map((link, i) => {
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

        const lineHeight = ((196 + 16) * indexDiff);

        return {
          offsetY: ((196 + 16) * firstIndex + (196 / 2) - 11),
          pathTierX: tier * 16 + 10,
          lineHeight,
          confidencePct: Math.round((1 - link.score) * 100),
          linkingMethod: prettyLinkMethod(link),
          totalRatings: link.ratings ? link.ratings.length : 0, // TODO: Remove this guarding when the link.rating data is fixed. Right now it can be null.
          key: link.key,
          duplicates: link.duplicates,
        };
      })
      .sort((a, b) => {
        //Sort so that greatest pathTierX value is rendered first
        if(a.pathTierX < b.pathTierX) {
          return 1;
        }
        if(a.pathTierX > b.pathTierX) {
          return -1;
        }
        return 0;
      });
  }

  ngOnInit(): void {
    this.drawableLinks = this.calculateDrawableLinks();
  }

  onMouseEnterLink(key) {
    this.hoveredLink = key;
  }

  onMouseLeaveLink(key) {
    if(this.hoveredLink === key) {
      this.hoveredLink = null;
    }
  }

  onMouseEnterTooltip(key) {
    this.hoveredTooltip = key;
  }

  onMouseLeaveTooltip(key) {
    if(this.hoveredTooltip === key) {
      this.hoveredTooltip = null;
    }
  }
}
