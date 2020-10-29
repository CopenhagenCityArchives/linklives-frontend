import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  //TODO: we need to be able to set this to a different one in prod, based on the concrete url in the wordpress theme?
  featherSpriteUrl = "/assets/feather-sprite_cbef33d2.svg";

  constructor() { }

  ngOnInit(): void {
  }

}
