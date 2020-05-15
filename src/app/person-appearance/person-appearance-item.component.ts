import { Component, OnInit, Input } from '@angular/core';
import { PersonAppearance } from '../search/search.service';

@Component({
  selector: 'app-person-appearance-item',
  templateUrl: './person-appearance-item.component.html',
  styleUrls: ['./person-appearance-item.component.scss']
})
export class PersonAppearanceItemComponent implements OnInit {

  @Input("item") personAppearance: PersonAppearance;

  constructor() { }

  ngOnInit(): void {
  }

}
