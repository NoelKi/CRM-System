import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-profil-picture',
  standalone: true,
  imports: [MatIcon, MatTooltip],
  template: `<img
      [src]="source()"
      alt="profil-image"
      (mouseenter)="isHovered = true"
      (mouseleave)="isHovered = false"
      (click)="fileInput.click()"
    />
    <mat-icon
      aria-hidden="false"
      aria-label="edit"
      (click)="fileInput.click()"
      [class.hovered]="isHovered"
      matTooltip="UPLOAD IMAGE"
      class="md-button md-raised md-primary"
      >edit</mat-icon
    >
    <input
      #fileInput
      style="display: none;"
      type="file"
      accept="image/png, image/jpeg"
      (change)="onFileSelected($event)"
    /> `,
  styleUrl: './profil-picture.component.scss'
})
export class ProfilPictureComponent {
  source = input.required<string>();
  imgFile = output<File>();
  isHovered = false;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imgFile.emit(input.files[0]);
    }
  }
}
