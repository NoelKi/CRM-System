import { Component, input } from '@angular/core';

@Component({
  selector: 'app-profil-picture',
  standalone: true,
  imports: [],
  template: `<img [src]="source()" />`,
  styleUrl: './profil-picture.component.scss'
})
export class ProfilPictureComponent {
  source = input.required<string>();
}
