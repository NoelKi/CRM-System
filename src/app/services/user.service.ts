import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { users } from '../../fake-db/user.data';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  users: User[] = users;

  constructor() {
  }

  addUser(user: User) {
    this.users.push(user);
    console.log(this.users);
  }

  deleteUser(user: User) {
    this.users.splice(
      this.users.indexOf(user), 1
    )
  }
}
