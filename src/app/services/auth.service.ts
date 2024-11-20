import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { CustomerEnum } from '../../core/enum/api.enum';
import { Customer } from '../../models/customer.model';

const USER_STORAGE_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userSignal = signal<Customer | null>(null);

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

  async login(email: string, password: string): Promise<Customer> {
    const login$ = this.http.post<Customer>(CustomerEnum.login, {
      email,
      password
    });

    const user = await firstValueFrom(login$);

    this._userSignal.set(user);

    return user;
  }

  async logout(): Promise<void> {
    localStorage.removeItem(USER_STORAGE_KEY);
    this._userSignal.set(null);
    await this._router.navigateByUrl('/login');
  }
}

interface ILogRes {
  status: string;
}
