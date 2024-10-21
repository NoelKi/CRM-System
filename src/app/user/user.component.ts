import { Component, inject } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { UserService } from '../services/user.service';

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
export class UserComponent {
  private _userService = inject(UserService);
  dialog = inject(MatDialog);

  displayedColumns: string[] = ['name', 'lastName', 'email', 'id'];
  dataSource = this._userService.users;

  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];

  openDialog() {
    this.dialog.open(DialogAddUserComponent, {
      height: '560px',
      width: '620px',
      maxWidth: '100%' // Maximale Breite, um sicherzustellen, dass der Dialog auf kleinen Bildschirmen passt
    });
  }
}
