import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-custom-mat-icon-btn',
    imports: [MatIconModule, MatButtonModule],
    template: '<button mat-icon-button><mat-icon>{{ icon() }}</mat-icon></button>'
})
export class CustomMatIconBtnComponent {
  icon = input('default');
}
