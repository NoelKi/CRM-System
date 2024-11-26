import { AsyncPipe } from '@angular/common';
import { Component, inject, input, OnInit, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { catchError, map, Observable, of } from 'rxjs';
import { Customer } from '../../../../models/customer.model';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-profil-picture',
  imports: [MatIcon, MatTooltip, AsyncPipe],
  template: ` @if (imgSrc$ | async; as imgSrc) {}
    <img
      [src]="imgSrc"
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
    />`,
  styleUrl: './profil-picture.component.scss'
})
export class ProfilPictureComponent implements OnInit {
  private _customerService = inject(CustomerService);
  imgSrc: any;
  imgSrc$!: Observable<string>;
  customer = input.required<Customer>();
  imgFile = output<File>();
  isHovered = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imgFile.emit(input.files[0]);
    }
  }

  ngOnInit(): void {
    console.log('Customer ID:', this.customer()._id);
    console.log('ProfilPicSrc:', this.customer().profilPicSrc);

    // Korrekte Zuweisung und Fehlerbehandlung
    this.imgSrc$ = this._customerService
      .getCustomerImg(this.customer()._id!, this.customer().profilPicSrc!)
      .pipe(
        map((blob) => {
          const url = URL.createObjectURL(blob);
          console.log('Blob URL:', url); // Debugging
          return url; // Gibt die URL zurück
        }),
        catchError((error) => {
          console.error('Fehler beim Laden des Bildes:', error);
          return of('assets/default-image.png'); // Fallback-Bild
        })
      );

    // Das Observable selbst wird hier geloggt, nicht der Wert
    console.log('Log', this.imgSrc$);

    this.imgSrc$.subscribe((url) => {
      console.log('Abonniertes Bild-URL:', url); // Sollte die Blob-URL oder das Fallback-Bild sein
    });
  }
}
