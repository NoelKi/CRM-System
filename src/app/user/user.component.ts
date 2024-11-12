import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import { User } from '../../models/user.model';
import { IGetUsersParams, UserService } from '../services/user.service';
import { DialogAddUserComponent } from './components/dialog-add-user/dialog-add-user.component';
import { DialogDeleteUserComponent } from './components/dialog-delete-user/dialog-delete-user.component';

@Component({
  selector: 'app-user',
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
    DatePipe
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  private _userService = inject(UserService);
  dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  private _router = inject(Router);

  paginator = viewChild.required(MatPaginator);
  sort = viewChild.required(MatSort);
  input = viewChild.required(MatInput);

  dataSource = new MatTableDataSource<User>([]);
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'birthDate', 'adress', 'edit'];
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  isLoadingResults = true;
  filterVariables: IGetUsersParams = {
    pageSize: 5,
    pageIndex: 0,
    filterValue: '',
    sortField: '',
    sortDirection: ''
  };

  // BehaviorSubjects

  private refreshUsers$ = new BehaviorSubject<void>(undefined);
  sortDirection$ = new BehaviorSubject<string>('asc');
  sortActive$ = new BehaviorSubject<string>('');
  pageIndex$ = new BehaviorSubject<number>(0);
  pageSize$ = new BehaviorSubject<number>(5);
  filter$ = new BehaviorSubject<string>('');
  users$ = new BehaviorSubject<User[]>([]);

  constructor() {}

  ngOnInit(): void {
    this.paginator().pageSize = this.pageSize$.value;
    console.log(this.paginator().page);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  onFilterChange(value: string) {
    this.pageIndex$.next(0);
    this.filter$.next(value);
  }

  onPageChange(event: PageEvent) {
    this.pageSize$.next(event.pageSize);
    this.pageIndex$.next(event.pageIndex);
  }

  onSortChange(sortState: Sort) {
    this.pageIndex$.next(0);
    this.sortDirection$.next(sortState.direction);
    this.sortActive$.next(sortState.active);
    console.log(this.pageIndex$.value);
  }

  usersData$ = combineLatest([
    this.filter$,
    this.sortDirection$,
    this.sortActive$,
    this.pageIndex$,
    this.pageSize$,
    this.refreshUsers$
  ]).pipe(
    switchMap(([filterValue, sortDirection, sortField, pageIndex, pageSize]) => {
      this.isLoadingResults = true;
      return this._userService
        .getUsersTest({
          filterValue,
          sortDirection,
          sortField,
          pageIndex,
          pageSize
        })
        .pipe(
          map((res) => {
            this.isLoadingResults = false;
            this.paginator().pageIndex = this.pageIndex$.value;
            this.paginator().length = res.totalLength;
            return res.users;
          })
        );
    })
  );

  openDialog() {
    const dialogRef = this.dialog.open(DialogAddUserComponent, {
      height: '660px',
      width: '620px',
      maxWidth: '100%'
    });
    dialogRef.afterClosed().subscribe((user) => {
      this.isLoadingResults = true;
      this._userService.addUser(user).subscribe({
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
    const dialogRef = this.dialog.open(DialogDeleteUserComponent, {
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
        this._userService.deleteUserTest(_id).subscribe({
          next: (res) => {
            if (res.status === 'OK') {
              this.refreshUsers$.next();
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
