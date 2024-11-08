import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-dialog-delete-user',
  standalone: true,
  imports: [MatDialogModule, MatProgressBar, MatButtonModule],
  templateUrl: './dialog-delete-user.component.html',
  styleUrl: './dialog-delete-user.component.scss'
})
export class DialogDeleteUserComponent {
  readonly dialogRef = inject(MatDialogRef<DialogDeleteUserComponent>);
  private _userService = inject(UserService);
  loading = false;
  id!: string;
  name!: string;

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteUser() {
    this._userService.deleteUser(this.id);
    this.dialogRef.close();
  }
}
