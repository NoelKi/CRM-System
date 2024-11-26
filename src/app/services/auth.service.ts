import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { firstValueFrom } from 'rxjs';
import { UserEnum } from '../../core/enum/api.enum';
import { User } from '../../models/login.model';

const USER_STORAGE_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userSignal = signal<User | null>(null);

  private _router = inject(Router);

  user = this._userSignal.asReadonly();

  isLoggedIn = computed(() => !!this.user());

  http = inject(HttpClient);

  constructor() {
    this.loadUserFromStorage();
    effect(() => {
      const user = this.user();
      console.log(user);

      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }
    });
  }

  loadUserFromStorage(): void {
    const json = localStorage.getItem(USER_STORAGE_KEY);
    if (json) {
      const user = JSON.parse(json);

      this._userSignal.set(user);
    }
  }

  async login(email: string, password: string): Promise<User> {
    const login$ = this.http.post<ILogRes>(UserEnum.login, {
      email,
      password
    });
    console.log(login$);

    const authPayload = await firstValueFrom(login$);

    const { user, authJwToken } = authPayload;

    this._userSignal.set(user);
    this.saveItemToStorage('jwt', authJwToken);

    console.log(user);

    return user;
  }

  // async login(email: string, password: string): Promise<User> {
  //   const user = users.find((user) => user.email === email && user.password === password);

  //   if (!user) {
  //     throw new Error('Invalid email or password');
  //   }

  //   // Setze das Signal mit dem gefundenen Benutzer
  //   this._userSignal.set(user);

  //   return user;
  // }

  async logout(): Promise<void> {
    localStorage.removeItem(USER_STORAGE_KEY);
    this._userSignal.set(null);
    await this._router.navigateByUrl('/login');
    this.removeItemFromStorage('jwt');
  }

  saveJwtToStorage(jwt: string): void {
    localStorage.setItem('jwt', jwt);
  }

  saveItemToStorage(itemKey: string, item: string): void {
    localStorage.setItem(itemKey, item);
  }

  loadItemFromStorage(itemKey: string): any {
    const json = localStorage.getItem(itemKey);
    if (json) {
      return json;
    }
  }

  removeItemFromStorage(itemKey: string): void {
    localStorage.removeItem(itemKey);
  }

  showMessage(message: string): void {
    console.log(message);
  }
}

interface ILogRes {
  user: {
    email: string;
    isAdmin: boolean;
    pictureUrl: string;
  };
  authJwToken: string;
}
