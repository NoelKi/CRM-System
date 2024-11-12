import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, OutputRefSubscription } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, map, Observable, of, tap } from 'rxjs';
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

  constructor() {}

  ngOnInit(): void {
    const paramId = this._route.snapshot.paramMap.get('id');
    if (paramId === null) {
      return;
    }
    this.user$ = this._userService.getUser(paramId).pipe(map((user) => new User(user)));
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
        !this.isUserEqual(editedUser, user)
          ? this.saveUser(editedUser)
          : this.openSnackBar('No changes detected', 'close');
      });
    }
  }

  isUserEqual(object1: object, object2: object): boolean {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      const val1 = (object1 as any)[key];
      const val2 = (object2 as any)[key];

      // Check if values are objects themselves and need recursive comparison
      const areObjects =
        typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null;

      if (
        (areObjects && !this.isUserEqual(val1, val2)) || // Recursive comparison for nested objects
        (!areObjects && val1 !== val2) // Direct comparison for primitive values
      ) {
        return false;
      }
    }
    return true;
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
    console.log('Selected file:', $event);
    this.editedUserImg$ = this._userService.editUserImg(user, $event).pipe(
      tap((res) => {
        if (res.status === 'OK') {
          this.openSnackBar('Profile Image Edited Successfully', 'close');
          user.profilPicSrc = res.profilPicSrc;
          console.log(res.profilPicSrc);

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
