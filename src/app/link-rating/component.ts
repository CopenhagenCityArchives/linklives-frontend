import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RatingService } from '../data/rating.service';
import { UserManagementService } from '../user-management/service';


@Component({
  selector: 'app-link-rating',
  templateUrl: './component.html',
  host: {
    '(document:keyup.escape)': 'closeOnEsc()'
  }
})

export class LinkRatingComponent implements OnInit {
  @Input() featherIconPath: string;
  @Input() linkId: string;
  @Input() totalRatings: number;
  @Input() ratingCountByCategory: any;
  @Input() ratedBy: string[];
  @Input() chosenRatingId;
  @Output() close: EventEmitter<any> = new EventEmitter();

  showForm = true;
  chosen: string = "";
  ratingOptions;
  currentPath = this.userManagement.currentPath();
  user;

  get openLinkRating() {
    return Boolean(this.linkId);
  }

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
      linkId: this.linkId,
    }

    const linkOption = this.ratingOptions.find(optionCategory => optionCategory.options.some(option => option.value == chosenRatingId));
    this.chosen = linkOption.category;

    this.ratingService.sendLinkRating(ratingData).subscribe({
      error: (e) => {
        if(e.message.match(/Login required/i)) {
          this.userManagement.handleLogin();
          return;
        }
        throw e;
      },
      complete: () => {
        this.totalRatings++;
        if(!this.ratingCountByCategory[linkOption.category]) {
          this.ratingCountByCategory[linkOption.category] = 0;
        }
        this.ratingCountByCategory[linkOption.category]++;
      }
    });

    this.showForm = false;
  }

  closeLinkRating() {
    this.showForm = true;
    this.chosen = "";
    this.linkId = null;
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
        currentLinkId: this.linkId,
        chosenRatingId: this.linkRatingForm.value.option
      }
    }).then(() => {
      this.userManagement.handleLogin();
    });
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.userManagement.getUser();

    this.ratingService.getLinkRatingOptions().subscribe((ratingOptions) => {
      this.ratingOptions = ratingOptions;
    });

    const chosenValue = parseInt(this.chosenRatingId);
    if(this.chosenRatingId && !Number.isNaN(chosenValue)) {
      this.linkRatingForm.setValue({ option: chosenValue });
    }
  }

  closeOnEsc() {
    // Close sidebar on escape keypress
    if(this.openLinkRating) {
      this.closeLinkRating();
    }
  }

  constructor(
    private router: Router,
    private ratingService: RatingService,
    public userManagement: UserManagementService,
  ) {}
}
