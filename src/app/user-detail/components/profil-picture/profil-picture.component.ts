import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-profil-picture',
  standalone: true,
  imports: [MatIcon],
  template: `<img
      [src]="source()"
      alt="profil-image"
      (mouseenter)="onHover()"
      (mouseleave)="onLeave()"
    />
    <mat-icon aria-hidden="false" [class]="{ hovered: isHovered }" aria-label="edit"
      >edit</mat-icon
    >`,
  styleUrl: './profil-picture.component.scss'
})
export class ProfilPictureComponent {
  source = input.required<string>();
  isHovered = false;

  onHover() {
    this.isHovered = true;
  }

  onLeave() {
    this.isHovered = false;
  }
}
