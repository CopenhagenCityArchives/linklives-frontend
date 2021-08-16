import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { AuthService } from '@auth0/auth0-angular';


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
  @Output() close: EventEmitter<any> = new EventEmitter();

  showForm = true;
  chosen: string = "";
  ratingOptions;

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

    this.elasticsearch.sendLinkRating(ratingData).subscribe(rate => {
      // update rating stats
      this.totalRatings++;
      this.ratingCountByCategory[linkOption.category]++;
    });

    this.elasticsearch.getLinkRatingStats(this.linkKey).subscribe(linkRatingData => {
      this.totalRatings = linkRatingData.totalRatings
      this.ratingCountByCategory = linkRatingData.headingRatings;
    });

    this.showForm = false;
  }

  closeLinkRating() {
    this.showForm = true;
    this.chosen = "";
    this.openLinkRating = false;
    this.linkRatingForm.reset();
    this.close.emit(null);
  }

  login() {
    localStorage.setItem('login-completed-path', window.location.pathname);
    if(window.location.search.length > 1) {
      localStorage.setItem('login-completed-query', window.location.search.substring(1))
    }
    this.auth.loginWithRedirect({
      appState: { target: 'login-completed' }
    })
  }

  ngOnInit(): void {
  }

  closeOnEsc() {
    // Close sidebar on escape keypress
    if(this.openLinkRating) {
      this.closeLinkRating();
    }
  }

  constructor(private elasticsearch: ElasticsearchService, public auth: AuthService) {
    this.elasticsearch.getLinkRatingOptions().subscribe(ratingOptions => {
      this.ratingOptions = ratingOptions;
    });  
  }  
}
