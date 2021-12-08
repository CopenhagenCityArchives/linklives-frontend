import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { AuthUtil } from '../auth/util'
import { RatingService } from '../rating/service';


@Component({
  selector: 'app-link-rating',
  templateUrl: './component.html',
  host: {
    '(document:keyup.escape)': 'closeOnEsc()'
  }
})

export class LinkRatingComponent implements OnInit {
  @Input() openLinkRating: boolean;
  @Input() featherIconPath: string;
  @Input() linkKey: string;
  @Input() totalRatings: number;
  @Input() ratingCountByCategory: any;
  @Input() ratedBy: string[];
  @Input() chosenRatingId;
  @Output() close: EventEmitter<any> = new EventEmitter();

  showForm = true;
  chosen: string = "";
  ratingOptions;
  currentPath = this.authUtil.currentPath();
  user;

  get ratingCategoriesWithCount() {
    const result = {};
    if(this.ratingOptions) {
      this.ratingOptions.forEach((option) => {
        result[option.category] = 0;
      });
    }

    if(this.ratingCountByCategory) {
      Object.keys(this.ratingCountByCategory).forEach((key) => {
        result[key] = this.ratingCountByCategory[key];
      });
    }

    return result;
  }

  get canRateLink() {
    if(!this.ratedBy || !this.user) {
      return true;
    }
    return !this.ratedBy.includes(this.user.sub);
  }

  percent(ratingCount) {
    return Math.round(parseInt(ratingCount) / this.totalRatings * 100);
  }

  linkRatingForm = new FormGroup({
    option: new FormControl(''),
  });

  onSubmit() {
    const chosenRatingId = this.linkRatingForm.value.option;
    const ratingData = {
      ratingId: chosenRatingId,
      linkKey: this.linkKey,
    }

    const linkOption = this.ratingOptions.find(optionCategory => optionCategory.options.some(option => option.value == chosenRatingId));
    this.chosen = linkOption.category;

    this.ratingService.sendLinkRating(ratingData).subscribe(rate => {
      this.totalRatings++;
      if(!this.ratingCountByCategory[linkOption.category]) {
        this.ratingCountByCategory[linkOption.category] = 0;
      }
      this.ratingCountByCategory[linkOption.category]++;
    });

    this.showForm = false;
  }

  closeLinkRating() {
    this.showForm = true;
    this.chosen = "";
    this.openLinkRating = false;
    this.linkRatingForm.reset();
    // reset url query
    this.router.navigate([this.currentPath], {
      queryParams: {}
    });
    this.close.emit(null);
  }

  login() {

    // changes the route without moving from the current view or
    // triggering a navigation event,
    this.router.navigate([this.currentPath], {
      queryParams: {
        currentLinkKey: this.linkKey,
        chosenRatingId: this.linkRatingForm.value.option
      }
    }).then(() => {
      this.authUtil.handleLogin();
    });
  }

  ngOnInit(): void {
    if(this.chosenRatingId && parseInt(this.chosenRatingId) !== NaN) {
      this.linkRatingForm.setValue({option: parseInt(this.chosenRatingId)});
    }
  }

  closeOnEsc() {
    // Close sidebar on escape keypress
    if(this.openLinkRating) {
      this.closeLinkRating();
    }
  }

  constructor(private router: Router, private ratingService: RatingService, public auth: AuthService, private authUtil: AuthUtil) {
    auth.user$.subscribe((user) => this.user = user);

    this.ratingService.getLinkRatingOptions().subscribe((ratingOptions) => {
      this.ratingOptions = ratingOptions;
    });
  }  
}
