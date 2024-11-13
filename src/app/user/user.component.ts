import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../services/user.service';
import { DialogAddUserComponent } from '../user/components/dialog-add-user/dialog-add-user.component';
import { DialogDeleteUserComponent } from '../user/components/dialog-delete-user/dialog-delete-user.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
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
    CdkDrag,
    DragDropModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  private _userService = inject(UserService);
  private _dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  private _router = inject(Router);
  private _sanitizer = inject(DomSanitizer);

  // private _paginator = viewChild.required(MatPaginator);

  // displayedColumns: string[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'birthDate', 'street', 'edit'];

  columns: any[] = [
    { tableHeader: 'First Name', key: 'firstName', sortable: true },
    { tableHeader: 'Last Name', key: 'lastName', sortable: true },
    { tableHeader: 'Email', key: 'email', sortable: true },
    {
      tableHeader: 'Birthdate',
      key: 'birthDate',
      sortable: true
      // render: 'element[column.key] | date'
    },
    { tableHeader: 'Street', key: 'street', sortable: true },
    {
      tableHeader: 'Edit',
      key: 'edit',
      sortable: false,
      render: `<a href='#'>edit</a>`
    }
  ];

  usersData$!: Observable<User[]>;

  isLoadingResults = false;
  private _sortDirection = signal('asc');
  private _sortActive = signal('');
  private _filter = signal('');
  private _refreshPage = signal(0);
  pageIndex = signal(0);
  pageSize = signal(5);
  totalLength = 0;
  previousIndex: number = 0;

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

  usersData = toSignal(
    toObservable(this.queryParams).pipe(
      switchMap(({ refreshPage, ...params }) => {
        this.isLoadingResults = true;

        return this._userService.getUsers(params).pipe(
          map((res) => {
            this.isLoadingResults = false;
            this.totalLength = res.totalLength;
            return res.users;
          })
        );
      })
    ),
    { initialValue: [] }
  );

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  getSanitizedHtml(html: string): SafeHtml {
    console.log(html);

    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  isDate(value: any): boolean {
    return value === Date;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  onFilterChange(value: string) {
    this.pageIndex.set(0);
    this._filter.set(value);
  }

  onPageChange(event: PageEvent) {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
  }

  onSortChange(sortState: Sort) {
    this.pageIndex.set(0);
    this._sortDirection.set(sortState.direction);
    this._sortActive.set(sortState.active);
  }

  openDialog() {
    const dialogRef = this._dialog.open(DialogAddUserComponent, {
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
    const dialogRef = this._dialog.open(DialogDeleteUserComponent, {
      height: '200px',
      width: '200px',
      maxWidth: '100%',
      data: {
        name: name
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this._userService.deleteUser(_id).subscribe({
          next: (res) => {
            if (res.status === 'OK') {
              this._refreshPage.set(this._refreshPage() + 1);
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
