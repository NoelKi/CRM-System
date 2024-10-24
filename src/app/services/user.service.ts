import { HttpClient } from '@angular/common/http';
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
    this.http.get<User[]>(UserEnum.getUsers).subscribe({
      next: (users: User[]) => {
        this.users.set(users); // wird aufgerufen, wenn Daten erfolgreich abgerufen werden
      },
      error: (error) => {
        console.error('Error fetching user', error); // Fehlerbehandlung
      },
      complete: () => {
        console.log('User fetch completed'); // optional, falls du etwas tun möchtest, wenn der Stream abgeschlossen ist
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
    const id = newUser.id;
    this.http.put<User>(UserEnum.editUser, newUser).subscribe({
      next: (user: User) => {
        console.log('User updated successfully:', user);
      },
      error: (error) => {
        console.error('Error fetching user', error); // Fehlerbehandlung
      },
      complete: () => {
        console.log('User update completed'); // optional, falls du etwas tun möchtest, wenn der Stream abgeschlossen ist
      }
    });
  }
}
