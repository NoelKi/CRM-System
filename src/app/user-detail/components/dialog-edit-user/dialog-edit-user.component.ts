import { Component, Inject, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepicker } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { User } from '../../../../models/user.model';
import { DialogAddUserComponent } from '../../../user/components/dialog-add-user/dialog-add-user.component';

@Component({
  selector: 'app-dialog-edit-user',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDatepicker,
    MatProgressBar
  ],
  templateUrl: './dialog-edit-user.component.html',
  styleUrl: './dialog-edit-user.component.scss'
})
export class DialogEditUserComponent {
  variable = 0;
  loading = false;
  user!: User;
  output = output<User>();
  // kind = input<string>('details');
  kind: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.kind = data.kind;
  }

  readonly dialogRef = inject(MatDialogRef<DialogAddUserComponent>);

  onNoClick(): void {
    this.dialogRef.close();
  }
  saveUser() {
    this.output.emit(this.user);
    this.dialogRef.close();
  }
}