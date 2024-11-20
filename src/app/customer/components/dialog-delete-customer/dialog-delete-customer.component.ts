import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-dialog-delete-customer',
  standalone: true,
  imports: [MatDialogModule, MatProgressBar, MatButtonModule],
  templateUrl: './dialog-delete-customer.component.html',
  styleUrl: './dialog-delete-customer.component.scss'
})
export class DialogDeleteCustomerComponent {
  readonly dialogRef = inject(MatDialogRef<DialogDeleteCustomerComponent>);
  loading = false;
  data: { name: string } = inject(MAT_DIALOG_DATA);
}
