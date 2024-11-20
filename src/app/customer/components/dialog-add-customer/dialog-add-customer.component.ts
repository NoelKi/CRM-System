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
import { Customer } from '../../../../models/customer.model';

@Component({
    selector: 'app-dialog-add-customer',
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
    templateUrl: './dialog-add-customer.component.html',
    styleUrl: './dialog-add-customer.component.scss'
})
export class DialogAddCustomerComponent {
  readonly dialogRef = inject(MatDialogRef<DialogAddCustomerComponent>);
  readonly userModel = model({});
  customer = new Customer();
  adressString = '';
  firstString = '';
  secoundString = '';
  thirdString = '';
  loading = false;

  constructor() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
