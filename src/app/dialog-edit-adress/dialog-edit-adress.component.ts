import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
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
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dialog-edit-adress',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './dialog-edit-adress.component.html',
  styleUrl: './dialog-edit-adress.component.scss'
})
export class DialogEditAdressComponent {
  loading = false;
  user!: User;
  private _userService = inject(UserService);
  readonly dialogRef = inject(MatDialogRef<DialogAddUserComponent>);
  onNoClick(): void {
    this.dialogRef.close();
  }

  saveUser() {
    this.loading = true;
    this._userService.editUser(this.user);
    this.loading = false;
    this.dialogRef.close();
  }
}
