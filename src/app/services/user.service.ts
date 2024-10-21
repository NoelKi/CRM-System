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
    this.users.update((users) => {
      return [...users, user];
    });
  }

  deleteUser(user: User) {
    this.users.update((users) => {
      return users.filter((u) => u !== user);
    });
  }

  getUser(id: string): User | undefined {
    const user = this.users().find((user) => user.id === id);
    return user ? { ...user } : undefined;
  }
}
