import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, effect, inject, OnInit, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../services/user.service';
import { DialogDeleteUserComponent } from '../user-detail/components/dialog-delete-user/dialog-delete-user.component';
import { DialogAddUserComponent } from './components/dialog-add-user/dialog-add-user.component';

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
    MatSortModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  private _userService = inject(UserService);
  private _liveAnnouncer = inject(LiveAnnouncer);
  dialog = inject(MatDialog);
  deleteDialog = inject(MatDialog);
  dataSource = new MatTableDataSource<User>([]);
  pageSize = 5;
  pageIndex = 0;
  usersLength = 0;
  sortDirection = '';
  sortField = '';
  filterValue = '';
  paginator = viewChild.required(MatPaginator);
  sort = viewChild.required(MatSort);
  input = viewChild.required(MatInput);
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'edit', 'delete'];
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  isLoadingResults = true;
  isRateLimitReached = true;

  constructor() {
    effect(() => {
      if (this._userService.users()) {
        // this.dataSource.data = this._userService.users();
        this.dataSource = new MatTableDataSource(this._userService.users());
        this.usersLength = this._userService.usersLength;
        this.paginator()!.length = this.usersLength;
        this.isLoadingResults = false;
      }
    });
  }

  ngOnInit(): void {
    this._userService.getUsers(this.pageSize, this.pageIndex);
    this.usersLength = this._userService.usersLength;
  }

  applyFilter(event: Event) {
    this.isLoadingResults = true;
    this.pageIndex = 0;
    this.filterValue = (event.target as HTMLInputElement).value;
    this._userService.getUsers(
      this.pageSize,
      this.pageIndex,
      this.filterValue,
      this.sortField,
      this.sortDirection
    );
  }

  onPageChange(event: PageEvent) {
    this.isLoadingResults = true;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this._userService.getUsers(this.pageSize, this.pageIndex);
  }

  openDialog() {
    this.dialog.open(DialogAddUserComponent, {
      height: '560px',
      width: '620px',
      maxWidth: '100%'
    });
  }

  openDeleteDialog(id: string, name: string) {
    const dialog = this.dialog.open(DialogDeleteUserComponent, {
      height: '200px',
      width: '200px',
      maxWidth: '100%'
    });
    dialog.componentInstance.id = id;
    dialog.componentInstance.name = name;
  }

  announceSortChange(sortState: Sort) {
    this.sortDirection = sortState.direction;
    this.sortField = sortState.active;
    this._userService.getUsers(
      this.pageSize,
      this.pageIndex,
      this.filterValue,
      this.sortField,
      this.sortDirection
    );
  }
}
