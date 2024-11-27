import { AsyncPipe } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { catchError, map, Observable, of } from 'rxjs';
import { CustomerService } from '../../../../services/customer.service';

@Component({
  selector: 'app-profil-picture',
  imports: [MatIcon, MatTooltip, AsyncPipe],
  template: ` @if (imgUrl$ | async; as imgUrl) {
    <img
      src="{{ imgUrl }}"
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
    />
  }`,
  styleUrl: './profil-picture.component.scss'
})
export class ProfilPictureComponent implements OnInit, OnDestroy {
  private _customerService = inject(CustomerService);
  imgUrl$!: Observable<string | null>;
  source = input.required<string>();
  imgFile = output<File>();
  isHovered = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imgFile.emit(input.files[0]);
    }
  }

  ngOnInit(): void {
    // Korrekte Zuweisung und Fehlerbehandlung
    this.imgUrl$ = this._customerService.getCustomerImg(this.source()).pipe(
      map((blob) => {
        const url = URL.createObjectURL(blob);
        return url; // Gibt die URL zurück
      }),
      catchError((error) => {
        console.error('Fehler beim Aktualisieren des Benutzers:', error);
        return of(null);
      })
    );
  }

  ngOnDestroy(): void {
    if (this.imgUrl$) {
      this.imgUrl$.subscribe((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    }
  }
}
