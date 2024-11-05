import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, computed, inject, OnInit, OutputRefSubscription, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, Observable, of, tap } from 'rxjs';
import { User } from '../../models/user.model';
import { IPutImgRes, IPutRes, UserService } from '../services/user.service';
import { DialogEditUserComponent } from './components/dialog-edit-user/dialog-edit-user.component';
import { ProfilPictureComponent } from './components/profil-picture/profil-picture.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    ProfilPictureComponent,
    AsyncPipe,
    JsonPipe,
    DatePipe
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
  userId: string | null = '';
  user!: User | undefined;
  private _route = inject(ActivatedRoute);
  private _userService = inject(UserService);
  private _snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);
  subs = [] as OutputRefSubscription[];
  user$!: Observable<any>; // <User>
  editedUser$!: Observable<IPutRes>;
  editedUserImg$!: Observable<IPutImgRes>;
  x = signal(10);
  y = computed(() => this.x() * 10);
  z = this.x() * 10;

  constructor() {
    console.log(this.y());
    this.x.set(29);
    console.log(this.y());
  }

  ngOnInit(): void {
    const paramId = this._route.snapshot.paramMap.get('id');
    if (paramId === null) {
      return;
    }
    this.user$ = this._userService.getUser(paramId);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  editUserDetail(kind: 'address' | 'details', user: User) {
    if (user) {
      const dialogRef = this.dialog.open(DialogEditUserComponent, {
        data: {
          user: { ...user },
          kind: kind
        }
      });
      dialogRef.afterClosed().subscribe((editedUser) => {
        this.saveUser(editedUser);
      });
    }
  }

  saveUser(editedUser: User) {
    this.editedUser$ = this._userService.editUser(editedUser).pipe(
      tap((res) => {
        if (res.status === 'OK') {
          this.user$ = of(editedUser);
          this.openSnackBar(
            editedUser.firstName + ' ' + editedUser.lastName + ' updated successfully!',
            'close'
          );
        }
      }),
      catchError((error) => {
        console.error('Fehler beim Aktualisieren des Benutzers:', error);
        this.openSnackBar('User update failed, please retry!', 'close');
        // Optional: Rückgabe eines leeren Observables, um den Fehler zu behandeln
        return EMPTY;
      })
    );
  }

  saveFile(user: User, $event: File) {
    // console.log('Selected file:', $event);
    this.editedUserImg$ = this._userService.editUserImg(user, $event).pipe(
      tap((res) => {
        if (res.status === 'OK') {
          this.openSnackBar('Profile Image Edited Successfully', 'close');
          user.profilPicSrc = res.profilPicSrc;
          this.user$ = of(user);
        }
      }),
      catchError((error) => {
        console.error('Fehler beim Aktualisieren des Benutzers:', error);
        this.openSnackBar('User update failed, please retry!', 'close');
        return EMPTY;
      })
    );
  }
}
