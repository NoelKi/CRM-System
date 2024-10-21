import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dialog-add-user',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss'
})
export class DialogAddUserComponent {
  readonly dialogRef = inject(MatDialogRef<DialogAddUserComponent>);
  readonly userModel = model({});
  user = new User();
  adressString = '';
  firstString = '';
  secoundString = '';
  thirdString = '';

  constructor() {
    this.splitStreetAndHouseNumber();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  splitStreetAndHouseNumber() {
    if (this.adressString.length > 3) {
      [this.firstString, this.secoundString, this.thirdString] = this.adressString.split(' ');
      if (this.firstString === 'string') {
      }
    }
  }

  saveUser() {
    this.splitStreetAndHouseNumber();
    console.log(this.user);
  }
}
