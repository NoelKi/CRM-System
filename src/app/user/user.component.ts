import { Component, inject, OnInit } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
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
    RouterModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  ngOnInit(): void {
    this._userService.getUsers();
  }

  private _userService = inject(UserService);
  dialog = inject(MatDialog);
  deleteDialog = inject(MatDialog);

  displayedColumns: string[] = ['name', 'lastName', 'email', 'edit', 'delete'];
  dataSource = this._userService.users;

  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];

  openDialog() {
    this.dialog.open(DialogAddUserComponent, {
      height: '560px',
      width: '620px',
      maxWidth: '100%' // Maximale Breite, um sicherzustellen, dass der Dialog auf kleinen Bildschirmen passt
    });
  }

  openDeleteDialog(id: string, name: string) {
    const dialog = this.dialog.open(DialogDeleteUserComponent, {
      height: '200px',
      width: '200px',
      maxWidth: '100%' // Maximale Breite, um sicherzustellen, dass der Dialog auf kleinen Bildschirmen passt
    });
    dialog.componentInstance.id = id;
    dialog.componentInstance.name = name;
  }
}
