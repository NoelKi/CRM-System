import { Component, ElementRef, input, output, viewChild } from '@angular/core';
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
    />
    <mat-icon
      aria-hidden="false"
      aria-label="edit"
      (click)="editImg()"
      [class.hovered]="isHovered"
      matTooltip="UPLOAD IMAGE"
      class="md-button md-raised md-primary"
      >edit</mat-icon
    >
    <input
      #fileInput
      style="display: none;"
      id="input-file-id"
      type="file"
      accept="image/png, image/jpeg"
      (change)="onFileSelected()"
    /> `,
  styleUrl: './profil-picture.component.scss'
})
export class ProfilPictureComponent {
  source = input.required<string>();
  isHovered = false;
  imgFile = output<File>();
  fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  editImg() {
    this.fileInput().nativeElement.click();
  }

  onFileSelected() {
    const file = this.fileInput().nativeElement.files?.[0];
    if (file) {
      this.setNewFile(file);
    }
  }

  setNewFile(file: File) {
    this.imgFile.emit(file);
  }
}
