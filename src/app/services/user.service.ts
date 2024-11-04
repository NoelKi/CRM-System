import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { UserEnum } from '../../core/enum/api.enum';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);
  users = signal([] as User[]);
  usersLength: number = 0;

  constructor() {}

  addUser(user: User) {
    this.http.post<IPostRes>(UserEnum.addUser, user).subscribe({
      next: (res) => {
        if (res.status === 'OK') {
          user.id = res.id;
          user.profilPicSrc = res.profilePicSrc;
          this.users.update((users) => {
            return [...users, user];
          });
        }
      },
      error: (error) => {
        console.error('Error posting user', error); // Fehlerbehandlung
      }
    });
  }

  deleteUser(id: string) {
    this.http.delete<IDeleteRes>(UserEnum.deleteUser.replace(':id', id)).subscribe({
      next: (res) => {
        if (res.status === 'OK') {
          this.users.update((users) => {
            return users.filter((u) => {
              return u.id !== id;
            });
          });
        }
      },
      error: (error) => {
        console.error('Error deleting user', error); // Fehlerbehandlung
      }
    });
  }

  getUsers(data: IGetUsersParams) {
    const httpParams = new HttpParams()
      .set('pageSize', data.pageSize.toString())
      .set('pageIndex', data.pageIndex.toString());
    if (data.filterValue) httpParams.set('filter', data.filterValue);
    if (data.sortField) httpParams.set('filter', data.sortField);
    if (data.sortDirection) httpParams.set('filter', data.sortDirection);
    this.http.get<IGetRes>(UserEnum.getUsers, { params: httpParams }).subscribe({
      next: (res: IGetRes) => {
        this.users.set(res.users);
        this.usersLength = res.totalLength;
      },
      error: (error) => {
        console.error('Error fetching user', error);
      }
    });
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(UserEnum.getUser.replace(':id', id));
  }

  editUserDepricated(newUser: User) {
    this.users.update((users) => {
      for (let i = 0; i < users.length; i++) {
        const id = users[i].id;
        if (id == newUser.id) {
          users[i] = newUser;
        }
      }
      return users;
    });
  }

  // lerning in map-fun functions: no {} = implizit return, with {} = no return
  editUserDepricated2(newUser: User) {
    this.users.update((users) => {
      return users.map((user) => {
        // user.id === newUser.id ? newUser : user;
        if (user.id == newUser.id) {
          user = newUser;
        }
        return user;
      });
    });
  }

  editUser(newUser: User) {
    return this.http.put<IPutRes>(UserEnum.editUser, newUser);
  }

  editUserImg(newUser: User, file: File) {
    // Erstellen Sie ein FormData-Objekt
    const formData = new FormData();

    // Fügen Sie die Benutzer-ID hinzu
    formData.append('id', newUser.id);

    // Fügen Sie die Datei hinzu
    formData.append('file', file);

    // const filename = file.name;
    // const url = UserEnum.editUserImg.replace(':filename', filename);

    return this.http.put<IPutImgRes>(UserEnum.editUserImg, formData);
  }
}

interface IPutRes {
  status: string;
}

interface IPutImgRes extends IPutRes {
  profilPicSrc: string;
}
interface IDeleteRes extends IPutRes {
  id: string;
}

interface IPostRes extends IDeleteRes {
  profilePicSrc: string;
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
