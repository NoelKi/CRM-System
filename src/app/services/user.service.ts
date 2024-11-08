import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, Observable } from 'rxjs';
import { UserEnum } from '../../core/enum/api.enum';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);
  users = signal([] as User[]);
  usersLength: number = 0;
  private _snackBar = inject(MatSnackBar);
  constructor() {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  addUser(user: User) {
    console.log('user service');
    return this.http.post<IPostRes>(UserEnum.addUser, user);
  }

  deleteUser(id: string, data: IGetUsersParams) {
    this.http.delete<IDeleteRes>(UserEnum.deleteUser.replace(':id', id)).subscribe({
      next: (res) => {
        if (res.status === 'OK') {
          console.log('deleted');
          this.getUsers(data);
          // this.users.update((users) => {
          //   return users.filter((u) => {
          //     console.log('id', u._id);
          //     return u._id !== id;
          //   });
          // });
          this.openSnackBar('User succesfully deleted!', 'close');
        }
      },
      error: (error) => {
        console.error('Error deleting user', error); // Fehlerbehandlung
        this.openSnackBar('User was not deleted properly', 'close');
      }
    });
  }

  async getUsers(data: IGetUsersParams) {
    const httpParams = this.createHttpParams(data);
    try {
      const { totalLength, users } = await firstValueFrom(
        this.http.get<IGetRes>(UserEnum.getUsers, { params: httpParams })
      );
      this.users.set(users);
      this.usersLength = totalLength;
    } catch (error) {
      console.error('Error fetching user', error);
    }
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(UserEnum.getUser.replace(':id', id));
  }

  editUser(newUser: User) {
    return this.http.put<IPutRes>(UserEnum.editUser, newUser);
  }

  editUserImg(newUser: User, file: File) {
    const formData = new FormData();
    console.log(newUser._id);

    formData.append('id', newUser._id!);
    formData.append('file', file);

    // const url = UserEnum.editUserImg.replace(':id', newUser._id);
    // return this.http.put<IPutImgRes>(url, formData);

    return this.http.put<IPutImgRes>(UserEnum.editUserImg, formData);
  }

  createHttpParams(data: IGetUsersParams): HttpParams {
    let httpParams = new HttpParams()
      .set('pageSize', data.pageSize.toString())
      .set('pageIndex', data.pageIndex.toString());
    if (data.filterValue) httpParams = httpParams.set('filter', data.filterValue);
    if (data.sortField) httpParams = httpParams.set('sortField', data.sortField);
    if (data.sortDirection) httpParams = httpParams.set('sortDirection', data.sortDirection);

    return httpParams;
  }
}

export interface IPutRes {
  status: string;
}

export interface IPutImgRes extends IPutRes {
  profilPicSrc: string;
}
interface IDeleteRes extends IPutRes {
  id: string;
}

interface IPostRes extends IDeleteRes {
  profilePicSrc: string;
  _id: string;
}

interface IGetRes {
  users: User[];
  totalLength: number;
}

export interface IGetUsersParams {
  pageSize: number;
  pageIndex: number;
  filterValue?: string;
  sortField?: string;
  sortDirection?: string;
}
