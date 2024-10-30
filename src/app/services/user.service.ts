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

  getUsers(pageSize: number, pageIndex: number, filter: string = '') {
    const params = new HttpParams()
      .set('pageSize', pageSize)
      .set('pageIndex', pageIndex)
      .set('filter', filter); //Create new HttpParams
    this.http.get<IGetRes>(UserEnum.getUsers, { params: params }).subscribe({
      next: (res: IGetRes) => {
        this.users.set(res.users); // Nutzer-Daten setzen
        this.usersLength = res.totalLength;
      },
      error: (error) => {
        console.error('Error fetching user', error); // Fehlerbehandlung
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

  editUser(newUser: User, file?: File) {
    if (!file) return this.http.put<IPutRes>(UserEnum.editUser, newUser);
    return this.http.put<IPutRes>(UserEnum.editUserImg, { id: newUser.id, file });
  }
}

interface IPutRes {
  status: string;
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
