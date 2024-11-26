import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, ComponentRef, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { DynamicComponent } from '../../core/dynamic/dynamic.component';
import { CustomerService } from '../services/customer.service';
import { DialogAddCustomerComponent } from './components/dialog-add-customer/dialog-add-customer.component';
import { DialogDeleteCustomerComponent } from './components/dialog-delete-customer/dialog-delete-customer.component';
import { getCustomerColumns } from './customer-columns';

@Component({
  selector: 'app-customer',
  imports: [
    CommonModule,
    MatIcon,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    RouterModule,
    MatPaginatorModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSortModule,
    CdkDropList,
    CdkDrag,
    DragDropModule,
    DynamicComponent
  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {
  private _customerService = inject(CustomerService);
  private _dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  private _router = inject(Router);

  private _sortDirection = signal('asc');
  private _sortActive = signal('');
  private _filter = signal('');
  private _refreshPage = signal(0);
  pageIndex = signal(0);
  pageSize = signal(5);

  queryParams = computed(() => {
    return {
      pageSize: this.pageSize(),
      pageIndex: this.pageIndex(),
      filterValue: this._filter(),
      sortField: this._sortActive(),
      sortDirection: this._sortDirection(),
      refreshPage: this._refreshPage()
    };
  });

  customersData = toSignal(
    toObservable(this.queryParams).pipe(
      switchMap(({ refreshPage, ...params }) => {
        this.isLoadingResults = true;
        console.log('naseBlase');

        return this._customerService.getCustomers(params).pipe(
          map((res) => {
            this.isLoadingResults = false;
            this.totalLength = res.totalLength;
            console.log(res.customers);

            return res.customers;
          })
        );
      })
    ),
    { initialValue: [] }
  );

  componentRef?: ComponentRef<DynamicComponent<any>>;
  isLoadingResults = false;
  totalLength = 0;
  previousIndex: number = 0;
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'birthDate', 'adress', 'edit'];

  columns = getCustomerColumns(
    this.openDeleteDialog.bind(this), // Methode als Callback binden
    (id: string) => this._router.navigate([`/customer/${id}`]) // Direkt einen Callback übergeben
  );

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  openSnackBar(message: string, action: string, duration = 3000): void {
    this._snackBar.open(message, action, { duration });
  }

  onFilterChange(value: string): void {
    this.pageIndex.set(0);
    this._filter.set(value);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
  }

  onSortChange(sortState: Sort): void {
    this.pageIndex.set(0);
    this._sortDirection.set(sortState.direction);
    this._sortActive.set(sortState.active);
  }

  openDialog(): void {
    const dialogRef = this._dialog.open(DialogAddCustomerComponent, {
      height: '580px',
      width: '620px',
      maxWidth: '100%'
    });
    dialogRef.afterClosed().subscribe((customer) => {
      if (!customer) return;
      this.isLoadingResults = true;
      this._customerService.addCustomer(customer).subscribe({
        next: (res) => {
          if (res.status === 'OK') {
            customer.profilPicSrc = res.profilePicSrc;
            customer._id = res._id;
            this.openSnackBar(
              customer.firstName + ' ' + customer.lastName + ' was added to Customers',
              'close'
            );
            this._router.navigate(['./customer/' + res._id]);
            this.isLoadingResults = false;
          }
        },
        error: (error) => {
          console.error('Error posting customer', error);
          this.isLoadingResults = false;
        }
      });
    });
  }

  openDeleteDialog(_id: string, name: string): void {
    const dialogRef = this._dialog.open(DialogDeleteCustomerComponent, {
      height: '200px',
      width: '200px',
      maxWidth: '100%',
      data: {
        name: name
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this._customerService.deleteCustomer(_id).subscribe({
          next: (res) => {
            if (res.status === 'OK') {
              this._refreshPage.set(this._refreshPage() + 1);
              this.openSnackBar('Customer succesfully deleted!', 'close');
            }
          },
          error: (error) => {
            console.error('Error deleting customer', error);
            this.openSnackBar('Customer was not deleted properly', 'close');
          }
        });
      }
    });
  }
}
