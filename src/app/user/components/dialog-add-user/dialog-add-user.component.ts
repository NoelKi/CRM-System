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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { User } from '../../../../models/user.model';
import { UserService } from '../../../services/user.service';

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
    MatNativeDateModule,
    MatProgressBarModule
  ],
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss'
})
export class DialogAddUserComponent {
  readonly dialogRef = inject(MatDialogRef<DialogAddUserComponent>);
  readonly userModel = model({});
  private _userService = inject(UserService);
  user = new User();
  adressString = '';
  firstString = '';
  secoundString = '';
  thirdString = '';
  loading = false;

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
    this.loading = true;
    // this.splitStreetAndHouseNumber();
    this._userService.addUser(this.user);
    this.dialogRef.close();
  }
}
