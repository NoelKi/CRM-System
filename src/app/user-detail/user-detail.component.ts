import { Component, inject, OnDestroy, OnInit, OutputRefSubscription } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../services/user.service';
import { DialogEditUserComponent } from './components/dialog-edit-user/dialog-edit-user.component';
import { ProfilPictureComponent } from './components/profil-picture/profil-picture.component';

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
  private _snackBar = inject(MatSnackBar);
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  editUserDetail(kind: 'address' | 'details') {
    if (this.user) {
      const dialogRef = this.dialog.open(DialogEditUserComponent, {
        data: {
          user: { ...this.user },
          kind: kind
        }
      });
      dialogRef.afterClosed().subscribe((editedUser) => {
        this.saveUser(editedUser);
      });
    }
  }

  saveUser(editedUser: User) {
    this._userService.editUser(editedUser).subscribe({
      next: (res) => {
        if ((res.status = 'OK')) {
          this.user = editedUser;
          this.openSnackBar(
            this.user.firstName + ' ' + this.user.lastName + ' updated successfully !',
            'close'
          );
        }
      },
      error: (error) => {
        console.error('Fehler beim Aktualisieren des Benutzers:', error);
        this.user = editedUser;
        this.openSnackBar('User update failed, please retry!', 'close');
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
