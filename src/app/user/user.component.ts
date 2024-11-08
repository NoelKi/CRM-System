import { DatePipe } from '@angular/common';
import { Component, effect, inject, OnInit, viewChild } from '@angular/core';
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
  deleteDialog = inject(MatDialog);
  dataSource = new MatTableDataSource<User>([]);
  private _snackBar = inject(MatSnackBar);
  paginator = viewChild.required(MatPaginator);
  sort = viewChild.required(MatSort);
  input = viewChild.required(MatInput);
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'birthDate', 'adress', 'edit'];
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  isLoadingResults = true;
  isRateLimitReached = true;
  filterVariables: IGetUsersParams = {
    pageSize: 5,
    pageIndex: 0,
    filterValue: '',
    sortField: '',
    sortDirection: ''
  };

  constructor(private _router: Router) {
    effect(() => {
      if (this._userService.users()) {
        this.dataSource = new MatTableDataSource(this._userService.users());
        this.paginator().length = this._userService.usersLength;
        this.isLoadingResults = false;
      }
    });
  }

  ngOnInit(): void {
    this._userService.getUsers(this.filterVariables);
    this.paginator().length = this._userService.usersLength;
  }

  // addMongoUser() {
  //   this._userService.fillDatabase();
  // }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  applyFilter(event: Event) {
    this.isLoadingResults = true;
    this.filterVariables.pageIndex = 0;
    this.filterVariables.filterValue = (event.target as HTMLInputElement).value;
    this._userService.getUsers(this.filterVariables);
  }

  onPageChange(event: PageEvent) {
    this.isLoadingResults = true;
    this.filterVariables.pageSize = event.pageSize;
    this.filterVariables.pageIndex = event.pageIndex;
    this._userService.getUsers(this.filterVariables);
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogAddUserComponent, {
      height: '660px',
      width: '620px',
      maxWidth: '100%'
    });
    dialogRef.afterClosed().subscribe((user) => {
      this._userService.addUser(user).subscribe({
        next: (res) => {
          if (res.status === 'OK') {
            user.profilPicSrc = res.profilePicSrc;
            user._id = res._id;
            this.openSnackBar(
              user.firstName + ' ' + user.lastName + ' was added to Users',
              'close'
            );
            this._router.navigate(['./user/' + user._id]);
          }
        },
        error: (error) => {
          console.error('Error posting user', error); // Fehlerbehandlung
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
        this._userService.deleteUser(_id, this.filterVariables);
      }
    });
  }

  announceSortChange(sortState: Sort) {
    this.filterVariables.sortDirection = sortState.direction;
    this.filterVariables.sortField = sortState.active;
    this._userService.getUsers(this.filterVariables);
  }
}
