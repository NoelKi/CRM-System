import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { DialogEditAdressComponent } from '../dialog-edit-adress/dialog-edit-adress.component';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
  userId: string | null = '';

  user!: User | undefined;

  private _route = inject(ActivatedRoute);
  private _userService = inject(UserService);

  // constructor(private route: ActivatedRoute, public dialog: MatDialog) {}
  constructor() {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.userId = paramMap.get('id');
      console.log('Got the ID: ' + this.userId);
    });
  }

  openAdressDialog() {}

  editUserAdress() {
    const dialog = this.dialog.open(DialogEditAdressComponent);
    dialog.componentInstance.user = this.user;
  }
  editUserDetail() {
    this.dialog.open(DialogEditUserComponent);
  }
}
