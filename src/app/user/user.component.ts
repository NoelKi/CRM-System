import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  computed,
  inject,
  signal,
  viewChild,
  ViewContainerRef
} from '@angular/core';
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
import { CustomMatIconBtnComponent } from '../../core/dynamic/components/custom-mat-icon-btn.component';
import { DynamicComponent } from '../../core/dynamic/dynamic.component';
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
    MatInputModule,
    MatProgressSpinnerModule,
    MatSortModule,
    CdkDropList,
    CdkDrag,
    DragDropModule,
    DynamicComponent
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  private _userService = inject(UserService);
  private _dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  private _router = inject(Router);
  private _vcr = viewChild('container', { read: ViewContainerRef });

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

  componentRef?: ComponentRef<DynamicComponent<any>>;
  isLoadingResults = false;
  totalLength = 0;
  previousIndex: number = 0;
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'birthDate', 'adress', 'edit'];

  // todo adress without dyn comp
  columns: any[] = [
    { tableHeader: 'First Name', key: 'firstName', sortable: true },
    { tableHeader: 'Last Name', key: 'lastName', sortable: true },
    { tableHeader: 'Email', key: 'email', sortable: true },
    {
      tableHeader: 'Birthdate',
      key: 'birthDate',
      sortable: true,
      renderFn: (data: any) => {
        const date = new Date(data.birthDate).toLocaleDateString('de-DE');
        return `${date}`;
      }
    },
    {
      tableHeader: 'Adress',
      key: 'adress',
      sortable: true,
      renderFn: (data: any) => `${data.street} ${data.houseNumber}`
    },
    {
      tableHeader: 'Edit',
      key: 'edit',
      sortable: false,
      render: [
        {
          component: CustomMatIconBtnComponent,
          callback: (componentRef: ComponentRef<CustomMatIconBtnComponent>, data: any) => {
            componentRef.setInput('icon', 'delete');
            componentRef.location.nativeElement.addEventListener('click', () =>
              this.openDeleteDialog(data._id, data.firstName)
            );
          }
        },
        {
          component: CustomMatIconBtnComponent,
          callback: (componentRef: ComponentRef<CustomMatIconBtnComponent>, data: any) => {
            componentRef.setInput('icon', 'edit');
            componentRef.location.nativeElement.addEventListener('click', () =>
              this._router.navigate([`/user/${data._id}`])
            );
          }
        }
      ]
    }
  ];

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
    const dialogRef = this._dialog.open(DialogAddUserComponent, {
      height: '580px',
      width: '620px',
      maxWidth: '100%'
    });
    dialogRef.afterClosed().subscribe((user) => {
      if (!user) return;
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
            this.isLoadingResults = false;
          }
        },
        error: (error) => {
          console.error('Error posting user', error);
          this.isLoadingResults = false;
        }
      });
    });
  }

  openDeleteDialog(_id: string, name: string): void {
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
