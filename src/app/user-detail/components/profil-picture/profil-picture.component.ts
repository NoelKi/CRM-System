import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-profil-picture',
  standalone: true,
  imports: [MatIcon],
  template: `<img
      [src]="source()"
      alt="profil-image"
      (mouseenter)="isHovered = true"
      (mouseleave)="isHovered = false"
    />
    <mat-icon
      aria-hidden="false"
      aria-label="edit"
      [class]="{ hovered: isHovered }"
      (click)="editImg()"
      >edit</mat-icon
    >`,
  styleUrl: './profil-picture.component.scss'
})
export class ProfilPictureComponent {
  source = input.required<string>();
  isHovered = false;

  editImg() {
    console.log('add edit logic here');
  }
}
