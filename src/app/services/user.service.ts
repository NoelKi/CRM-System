import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { UserEnum } from '../../core/enum/api.enum';
import { users } from '../../fake-db/user.data';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);
  users = signal(users);

  constructor() {}

  addUser(user: User) {
    this.users.update((users) => {
      return [...users, user];
    });
  }

  deleteUser(user: User) {
    this.users.update((users) => {
      return users.filter((u) => {
        u !== user;
      });
    });
  }

  getUsers() {
    this.http.get<User[]>(UserEnum.getUsers).subscribe((res) => {
      console.log(res);
    });
    return this.users;
  }

  getUser(id: string) {
    return this.http.get<User>(UserEnum.getUser.replace(':id', id)).subscribe((res) => {
      res ? res : undefined;
    });
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
  editUser(newUser: User) {
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
}
