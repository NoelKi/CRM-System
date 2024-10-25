import { Component, inject, OnDestroy, OnInit, OutputRefSubscription } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { DialogEditAdressComponent } from '../dialog-edit-adress/dialog-edit-adress.component';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { ProfilPictureComponent } from '../profil-picture/profil-picture.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatMenuModule, ProfilPictureComponent],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit, OnDestroy {
  userId: string | null = '';

  user!: User | undefined;

  private _route = inject(ActivatedRoute);
  private _userService = inject(UserService);
  dialog = inject(MatDialog);
  subs = [] as OutputRefSubscription[];

  constructor() {}

  ngOnInit(): void {
    const paramId = this._route.snapshot.paramMap.get('id');
    if (paramId === null) {
      return;
    }
    this._userService.getUser(paramId).subscribe({
      next: (user: User) => {
        this.user = user; // wird aufgerufen, wenn Daten erfolgreich abgerufen werden
      },
      error: (error) => {
        console.error('Error fetching user', error); // Fehlerbehandlung
      }
    });
  }

  editUserAdress() {
    const dialog = this.dialog.open(DialogEditAdressComponent);
    if (this.user) {
      dialog.componentInstance.user = { ...this.user };
      const output = dialog.componentInstance.output.subscribe((user) => {
        this.saveUser(user);
      });
      this.subs.push(output);
    }
  }

  editUserDetail() {
    const dialog = this.dialog.open(DialogEditUserComponent);
    if (this.user) {
      dialog.componentInstance.user = Object.assign({}, this.user);
      const output = dialog.componentInstance.output.subscribe((user) => {
        this.saveUser(user);
      });
      this.subs.push(output);
    }
  }

  saveUser(editedUser: User) {
    this._userService.editUser(editedUser).subscribe({
      next: (res) => {
        if ((res.status = 'OK')) {
          this.user = editedUser;
        }
      },
      error: (error) => {
        console.error('Fehler beim Aktualisieren des Benutzers:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
