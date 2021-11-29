import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Link } from '../elasticsearch/elasticsearch.service';
import { prettyDate } from '../util/display-helpers';
import { PersonAppearance } from '../search/search.service';
import { getLatestSearchQuery } from '../search-history';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';

@Component({
  selector: 'app-life-course',
  templateUrl: './life-course.component.html',
})
export class LifeCourseComponent implements OnInit {
  pas: PersonAppearance[] = [];
  lifecourseKey: string;
  lifecourseId: number;
  links: Link[];
  getLatestSearchQuery = getLatestSearchQuery;

  get config() {
    return window["lls"];
  }

  featherSpriteUrl = this.config.featherIconPath;
  openSearchHistory: boolean = false;
  currentLinkKey: string = "";
  chosenRatingId;
  totalRatings;
  ratingCountByCategory;
  ratedBy;

  get aboutLifeCourseText() {
    return this.config.aboutLifeCourseText;
  }

  get latestPersonAppearance() {
    return this.pas[this.pas.length - 1];
  }

  get personName() {
    return this.latestPersonAppearance.name_display;
  }

  get birthPlace() {
    const firstPaWithBirthPlace = this.pas.find((pa) => pa.birthplace_display);
    return firstPaWithBirthPlace ? firstPaWithBirthPlace.birthplace_display : "";
  }

  get birthYear() {
    const firstPaWithBirthYear = this.pas.find((pa) => pa.birthyear_display);
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

  openLinkRating(linkKey, chosenRatingId="") {
    this.currentLinkKey = linkKey;
    this.chosenRatingId = chosenRatingId;

    this.elasticsearch.getLinkRatingStats(linkKey).subscribe(({ totalRatings, headingRatings, ratedBy }) => {
      this.totalRatings = totalRatings
      this.ratingCountByCategory = headingRatings;
      this.ratedBy = ratedBy;
    });
  }

  constructor(private route: ActivatedRoute, private elasticsearch: ElasticsearchService) { }

  ngOnInit(): void {
    this.route.data.subscribe(next => {
      // Sort person appearances by event year
      this.pas = next.lifecourse.personAppearances.sort(function(a, b) {
        if (a.event_year_display > b.event_year_display) {
          return 1;
        }
        if (a.event_year_display < b.event_year_display) {
          return -1;
        }
        return 0;
      }) as PersonAppearance[];

      this.lifecourseKey = next.lifecourse.lifecourseKey;
      this.lifecourseId = next.lifecourse.lifecourseId;
      this.links = next.lifecourse.links;

      if(next.lifecourse.currentLinkKey) {
        this.openLinkRating(next.lifecourse.currentLinkKey, next.lifecourse.chosenRatingId);
      }
    });
  }

}
