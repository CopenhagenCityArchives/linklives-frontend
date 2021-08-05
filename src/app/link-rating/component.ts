import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';


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
  @Output() close: EventEmitter<any> = new EventEmitter();

  showForm = true;
  //totalRatings: number;
  chosen: string = "";
  ratingOptions;
  //ratingCountByCategory;

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

    this.showForm = false;
  }

  closeLinkRating() {
    this.showForm = true;
    this.linkOptions = this.linkOptions.map(option => ({...option, chosen: false}));
    this.close.emit(null);
  }

  ngOnInit(): void {
  }

  closeOnEsc() {
    // Close sidebar on escape keypress
    if(this.openLinkRating) {
      this.closeLinkRating();
    }
  }

  constructor(private elasticsearch: ElasticsearchService) {
    this.elasticsearch.getLinkRatingOptions().subscribe(
      linkOptions => {  
      this.linkOptions = linkOptions;
      });
    
    this.elasticsearch.getLinkRatingStats(this.linkKey).subscribe(linkRatingData => {
      this.totalRatings = linkRatingData.totalRatings
      this.ratingCountByCategory = linkRatingData.headingRatings;
    });
  
  }  
}
