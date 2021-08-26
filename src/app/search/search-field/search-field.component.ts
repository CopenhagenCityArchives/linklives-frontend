import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
})
export class SearchFieldComponent implements OnInit {

  @Input("types") types: { id: number, name: string, description: string }[];
  @Input("field") model: { type: { id: number, name: string, description: string }, value: any };

  constructor() { }

  ngOnInit(): void {}

  setType(event: Event) {
    var select = event.target as HTMLSelectElement;
    this.model.type = this.types.find(type => type.id == Number(select.value));
  }

}
