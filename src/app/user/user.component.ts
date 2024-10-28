import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
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
    MatButton,
    MatIcon,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatTableModule,
    RouterModule,
    MatPaginatorModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  private _userService = inject(UserService);
  dialog = inject(MatDialog);
  deleteDialog = inject(MatDialog);
  dataSource = new MatTableDataSource<User>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this._userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.dataSource.paginator = this.paginator; // Set paginator after data is loaded
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  displayedColumns: string[] = ['name', 'lastName', 'email', 'edit', 'delete'];

  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];

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
}
