import { Component, OnInit, Input } from '@angular/core';
import { prettyBirthLocation, prettySourceLocation } from '../display-helpers';
import { PersonAppearance } from '../search/search.service';

@Component({
  selector: 'app-person-appearance-item',
  templateUrl: './person-appearance-item.component.html',
  styleUrls: ['./person-appearance-item.component.scss']
})
export class PersonAppearanceItemComponent implements OnInit {

  @Input("item") personAppearance: PersonAppearance;

  get config() {
    return window["lls"];
  }

  featherSpriteUrl = this.config.featherIconPath;

  get birthLocation() {
    return prettyBirthLocation(this.personAppearance);
  }

  get sourceLocation() {
    return prettySourceLocation(this.personAppearance);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
