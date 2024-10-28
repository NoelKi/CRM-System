import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dialog-delete-user',
  standalone: true,
  imports: [MatDialogModule, MatProgressBar, MatButtonModule],
  templateUrl: './dialog-delete-user.component.html',
  styleUrl: './dialog-delete-user.component.scss'
})
export class DialogDeleteUserComponent {
  readonly dialogRef = inject(MatDialogRef<DialogDeleteUserComponent>);
  loading = false;
  private _userService = inject(UserService);
  id!: string;
  name!: string;

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteUser() {
    this.loading = true;
    console.log(this.id);
    console.log(this.name);

    // this.loading = true;
    this._userService.deleteUser(this.id);
    this.loading = false;
    this.dialogRef.close();
  }
}
