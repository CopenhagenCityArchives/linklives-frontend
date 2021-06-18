import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-link-rating',
  templateUrl: './component.html',
  host: {
    '(document:keyup.escape)': 'closeOnEsc()'
  }
})

export class LinkRatingComponent implements OnInit {
  @Input() openLinkRating: boolean;
  @Output() close: EventEmitter<any> = new EventEmitter();

  linkOptions = [
    {
      title: "Den ser go ud",
      options: [
        {
          label: "fordi jeg bare kender den",
          value: 1,
        },
        {
          label: "den er rigtig",
          value: 2,
        },
        {
          label: "min mor sir det",
          value: 3,
        }
      ]
    },
    {
      title: "Dårlig",
      options: [
        {
          label: "Den er forkert",
          value: 4,
        },
        {
          label: "øv",
          value: 5,
        },
        {
          label: "ik brug den",
          value: 6,
        }
      ]
    }
  ]

  numberOfRatings = 4;

  linkRatingForm = new FormGroup({
    option: new FormControl(''),
  });

  onSubmit() {
    console.log("chosen option:", this.linkRatingForm.value.option);
  }

  closeLinkRating() {
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
}
