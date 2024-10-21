import { Injectable, signal } from '@angular/core';
import { users } from '../../fake-db/user.data';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users = signal(users);

  constructor() {}

  addUser(user: User) {
    // this.users().push(user);
    const users = this.users();
    users.push(user);
    this.users.set(users);
    // console.log(this.users());
  }

  deleteUser(user: User) {
    this.users().splice(this.users().indexOf(user), 1);
  }
}
