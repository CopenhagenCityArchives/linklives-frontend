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

  get aboutLifeCourseText() {
    return this.config.aboutLifeCourseText;
  }

  get personAppearancesSortedByYear() {
    //TODO: this is destructive and changes the sorting of pas permanently, even when not accessing through this.
    //      should it be an on-init thing instead?
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

  openLinkRating(linkKey, chosenRatingId="") {
    this.currentLinkKey = linkKey;
    this.chosenRatingId = chosenRatingId;
    this.elasticsearch.getLinkRatingStats(linkKey).subscribe(linkRatingData => {
      this.totalRatings = linkRatingData.totalRatings
      this.ratingCountByCategory = linkRatingData.headingRatings;
    });
  }

  constructor(private route: ActivatedRoute, private elasticsearch: ElasticsearchService) { }

  ngOnInit(): void {
    this.route.data.subscribe(next => {
      this.pas = next.lifecourse.personAppearances as PersonAppearance[];
      this.lifecourseKey = next.lifecourse.lifecourseKey;
      this.links = next.lifecourse.links;

      if(next.lifecourse.currentLinkKey) {
        this.openLinkRating(next.lifecourse.currentLinkKey, next.lifecourse.chosenRatingId);
      }
    });
  }

}
