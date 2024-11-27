import { CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import { CustomerService } from '../../services/customer.service';
import { DialogAddCustomerComponent } from '../customer/components/dialog-add-customer/dialog-add-customer.component';
import { DialogDeleteCustomerComponent } from '../customer/components/dialog-delete-customer/dialog-delete-customer.component';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    MatIcon,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    RouterModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSortModule,
    DatePipe,
    CdkDropList,
    DragDropModule,
    MatTableModule
  ],
  templateUrl: './user-behaviorSubject.component.html',
  styleUrl: './user-behaviorSubject.component.scss'
})
export class UserSignalComponent implements OnInit {
  private _customerService = inject(CustomerService);
  private _dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  private _router = inject(Router);

  private _paginator = viewChild.required(MatPaginator);

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'birthDate', 'adress', 'edit'];
  isLoadingResults = true;

  // BehaviorSubjects
  private _refreshCutomers$ = new BehaviorSubject<void>(undefined);
  private _sortDirection$ = new BehaviorSubject<string>('asc');
  private _sortActive$ = new BehaviorSubject<string>('');
  private _pageIndex$ = new BehaviorSubject<number>(0);
  private _pageSize$ = new BehaviorSubject<number>(5);
  private _filter$ = new BehaviorSubject<string>('');

  filterVariables: IGetCustomersBehaviorParams = {
    pageSize: this._pageSize$,
    pageIndex: this._pageIndex$,
    filterValue: this._filter$,
    sortField: this._sortActive$,
    sortDirection: this._sortDirection$
  };

  ngOnInit(): void {
    this._paginator().pageSize = this._pageSize$.value;
    console.log(this._filter$);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  onFilterChange(value: string) {
    this._pageIndex$.next(0);
    this._filter$.next(value);
  }

  onPageChange(event: PageEvent) {
    this._pageSize$.next(event.pageSize);
    this._pageIndex$.next(event.pageIndex);
  }

  onSortChange(sortState: Sort) {
    this._pageIndex$.next(0);
    this._sortDirection$.next(sortState.direction);
    this._sortActive$.next(sortState.active);
  }

  customersData$ = combineLatest([
    this.filterVariables.filterValue,
    this.filterVariables.sortDirection,
    this.filterVariables.sortField,
    this.filterVariables.pageIndex,
    this.filterVariables.pageSize,
    this._refreshCutomers$
  ]).pipe(
    switchMap(([filterValue, sortDirection, sortField, pageIndex, pageSize]) => {
      this.isLoadingResults = true;
      return this._customerService
        .getCustomers({
          filterValue,
          sortDirection,
          sortField,
          pageIndex,
          pageSize
        })
        .pipe(
          map((res) => {
            this.isLoadingResults = false;
            this._paginator().pageIndex = this._pageIndex$.value;
            this._paginator().length = res.totalLength;
            return res.customers;
          })
        );
    })
  );

  openDialog() {
    const dialogRef = this._dialog.open(DialogAddCustomerComponent, {
      height: '660px',
      width: '620px',
      maxWidth: '100%'
    });
    dialogRef.afterClosed().subscribe((user) => {
      this.isLoadingResults = true;
      this._customerService.addCustomer(user).subscribe({
        next: (res) => {
          if (res.status === 'OK') {
            user.profilPicSrc = res.profilePicSrc;
            user._id = res._id;
            this.openSnackBar(
              user.firstName + ' ' + user.lastName + ' was added to Users',
              'close'
            );
            this._router.navigate(['./user/' + res._id]);
          }
        },
        error: (error) => {
          console.error('Error posting user', error);
        }
      });
    });
  }

  openDeleteDialog(_id: string, name: string) {
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
        this.isLoadingResults = true;
        this._customerService.deleteCustomer(_id).subscribe({
          next: (res) => {
            if (res.status === 'OK') {
              this._refreshCutomers$.next();
              this.openSnackBar('User succesfully deleted!', 'close');
            }
          },
          error: (error) => {
            console.error('Error deleting user', error);
            this.openSnackBar('User was not deleted properly', 'close');
          }
        });
      }
    });
  }
}

interface IGetCustomersBehaviorParams {
  pageSize: BehaviorSubject<number>;
  pageIndex: BehaviorSubject<number>;
  filterValue: BehaviorSubject<string>;
  sortField: BehaviorSubject<string>;
  sortDirection: BehaviorSubject<string>;
}
