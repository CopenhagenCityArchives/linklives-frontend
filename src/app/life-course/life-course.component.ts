import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Link } from '../data/data.service';
import { PersonAppearance } from '../search/search.service';
import { getLatestSearchQuery } from '../search-history';
import { RatingService } from '../data/rating.service';

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
  currentLinkId: string = "";
  chosenRatingId;
  totalRatings;
  ratingCountByCategory;
  ratedBy;
  data_version: string;
  is_historic: boolean;

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

  openLinkRating(linkId, chosenRatingId="") {
    this.currentLinkId = linkId;
    this.chosenRatingId = chosenRatingId;

    this.ratingService.getLinkRatingStats(linkId).subscribe(({ totalRatings, headingRatings, ratedBy }) => {
      this.totalRatings = totalRatings;
      this.ratingCountByCategory = headingRatings;
      this.ratedBy = ratedBy;
    });
  }

  constructor(private route: ActivatedRoute, private ratingService: RatingService) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ lifecourse }) => {
      // Sort person appearances by event year
      this.pas = lifecourse.personAppearances.sort(function(a, b) {
        if (a.event_year_display > b.event_year_display) {
          return 1;
        }
        if (a.event_year_display < b.event_year_display) {
          return -1;
        }
        return 0;
      }) as PersonAppearance[];

      this.lifecourseKey = lifecourse.lifecourseKey;
      this.lifecourseId = lifecourse.lifecourseId;
      this.links = lifecourse.links;
      this.data_version = lifecourse.data_version;
      this.is_historic = lifecourse.is_historic;

      if(lifecourse.currentLinkId) {
        this.openLinkRating(lifecourse.currentLinkId, lifecourse.chosenRatingId);
      }
    });
  }

}
