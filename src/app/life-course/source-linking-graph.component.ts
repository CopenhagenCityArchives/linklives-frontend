import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Link } from '../data/data.service';
import { PersonAppearance } from '../search/search.service';

interface DrawableLink {
  offsetY: number,
  pathTierX: number,
  lineHeight: number,
  confidencePct: number,
  linkingMethod: { long: string, short: string },
  totalRatings: number,
  id: string,
  duplicates: boolean,
};

@Component({
  selector: 'app-source-linking-graph',
  templateUrl: './source-linking-graph.component.html',
})
export class SourceLinkingGraphComponent implements OnInit {

  @Input() pas: PersonAppearance[] = [];
  @Input() links: Link[] = [];

  @Output()
  openLinkRating: EventEmitter<string> = new EventEmitter<string>();

  drawableLinks: DrawableLink[] = [];

  hoveredLink?: string = null;
  hoveredTooltip?: string = null;

  get activeLink() {
    return this.hoveredLink || this.hoveredTooltip;
  }

  get pasReversed() {
    return [ ...this.pas ].reverse();
  }

  calculateDrawableLinks(): DrawableLink[] {
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

        const prettyLinkMethod = (methodId: "0"|"1"|"2") => {
          if(methodId === "2") {
            return {
              short: "Manuelt",
              long: "Manuelt skabt link af en person i Link-Lives teamet.",
            };
          }
          if(methodId === "1") {
            return {
              short: "Regel - husstand",
              long: "Regelbaseret link skabt ud fra sammenhængen mellem person og husstand.",
            };
          }
          if(methodId === "0") {
            return {
              short: "Regel - person",
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
          linkingMethod: prettyLinkMethod(link.method_id),
          totalRatings: link.ratings ? link.ratings.length : 0, // TODO: Remove this guarding when the link.rating data is fixed. Right now it can be null.
          id: link.id,
          duplicates: link.duplicates > 1,
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

  onMouseEnterLink(id) {
    this.hoveredLink = id;
  }

  onMouseLeaveLink(id) {
    if(this.hoveredLink === id) {
      this.hoveredLink = null;
    }
  }

  onMouseEnterTooltip(id) {
    this.hoveredTooltip = id;
  }

  onMouseLeaveTooltip(id) {
    if(this.hoveredTooltip === id) {
      this.hoveredTooltip = null;
    }
  }
}
