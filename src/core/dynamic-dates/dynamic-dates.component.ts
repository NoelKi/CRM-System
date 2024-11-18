import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dynamic-dates',
  standalone: true,
  imports: [DatePipe],
  template: '<p>{{ date() | date: type()}} </p>',
  styles: ''
})
export class DynamicDatesComponent {
  date = input.required<Date>();
  type = input<string>('short');
}
