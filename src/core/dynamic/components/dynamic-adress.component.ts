import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dynamic-adress',
  standalone: true,
  imports: [],
  template: '<p>{{ street() }} {{ houseNumber() }} </p>',
  styles: ''
})
export class DynamicAdressComponent {
  street = input.required();
  houseNumber = input.required();
}
