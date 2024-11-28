import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, OutputRefSubscription } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, map, Observable, of, tap } from 'rxjs';

import { Customer } from '../../../../models/customer.model';

import { CustomerService, IPutImgRes, IPutRes } from '../../services/customer.service';
import { DialogEditCustomerComponent } from './components/dialog-edit-customer/dialog-edit-customer.component';
import { ProfilPictureComponent } from './components/profil-picture/profil-picture.component';

@Component({
  selector: 'app-customer-detail',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    ProfilPictureComponent,
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.scss'
})
export class CustomerDetailComponent implements OnInit {
  customerId: string | null = '';
  customer!: Customer | undefined;
  private _route = inject(ActivatedRoute);
  private _customerService = inject(CustomerService);
  private _snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);
  subs = [] as OutputRefSubscription[];
  customer$!: Observable<any>;
  editedCustomer$!: Observable<IPutRes>;
  editedCustomerImg$!: Observable<IPutImgRes>;

  constructor() {}

  ngOnInit(): void {
    const paramId = this._route.snapshot.paramMap.get('id');
    if (paramId === null) {
      return;
    }
    this.customer$ = this._customerService.getCustomer(paramId).pipe(
      map((customer) => {
        return new Customer(customer);
      })
    );
  }

  openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  editCustomerDetail(kind: 'address' | 'details', customer: Customer): void {
    if (customer) {
      const dialogRef = this.dialog.open(DialogEditCustomerComponent, {
        data: {
          customer: { ...customer },
          kind: kind
        }
      });
      dialogRef.afterClosed().subscribe((editedCustomer) => {
        !this.isCustomerEqual(editedCustomer, customer)
          ? this.saveCustomer(editedCustomer)
          : this.openSnackBar('No changes detected', 'close');
      });
    }
  }

  isCustomerEqual(object1: object, object2: object): boolean {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      const val1 = (object1 as any)[key];
      const val2 = (object2 as any)[key];

      // Check if values are objects themselves and need recursive comparison
      const areObjects =
        typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null;

      if (
        (areObjects && !this.isCustomerEqual(val1, val2)) || // Recursive comparison for nested objects
        (!areObjects && val1 !== val2) // Direct comparison for primitive values
      ) {
        return false;
      }
    }
    return true;
  }

  saveCustomer(editedCustomer: Customer): void | Observable<never> {
    this.editedCustomer$ = this._customerService.editCustomer(editedCustomer).pipe(
      tap((res) => {
        if (res.status === 'OK') {
          this.customer$ = of(editedCustomer);
          this.openSnackBar(
            editedCustomer.firstName + ' ' + editedCustomer.lastName + ' updated successfully!',
            'close'
          );
        }
      }),
      catchError((error) => {
        console.error('Fehler beim Aktualisieren des Benutzers:', error);
        this.openSnackBar('Customer update failed, please retry!', 'close');
        // Optional: Rückgabe eines leeren Observables, um den Fehler zu behandeln
        return EMPTY;
      })
    );
  }

  saveFile(customer: Customer, $event: File): void | Observable<never> {
    this.editedCustomerImg$ = this._customerService.editCustomerImg(customer, $event).pipe(
      tap((res) => {
        if (res.status === 'OK') {
          this.openSnackBar('Profile Image Edited Successfully', 'close');
          customer.profilPicSrc = res.profilPicSrc;

          this.customer$ = of(customer);
        }
      }),
      catchError((error) => {
        console.error('Fehler beim Aktualisieren des Benutzers:', error);
        this.openSnackBar('Customer update failed, please retry!', 'close');
        return EMPTY;
      })
    );
  }
}
