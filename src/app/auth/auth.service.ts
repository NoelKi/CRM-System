import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, firstValueFrom, Observable, tap, throwError } from 'rxjs';
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

      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }
    });
  }

  destroyUser(): void {
    this._userSignal.set(null);
  }

  loadUserFromStorage(): void {
    const json = localStorage.getItem(USER_STORAGE_KEY);
    if (json) {
      const user = JSON.parse(json);

      this._userSignal.set(user);
    }
  }

  async checkAuthStatus(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ isAuthenticated: boolean }>('/api/auth-status', {
          withCredentials: true // Wichtig, um Cookies mitzuschicken
        })
      );
      return response.isAuthenticated;
    } catch (error) {
      console.error('Benutzer ist nicht authentifiziert:', error);
      return false;
    }
  }

  refreshAccessToken(): Observable<IRefAccToken> {
    return this.http.post<IRefAccToken>(UserEnum.refresh, { withCredentials: true }).pipe(
      tap((res) => {
        this.saveItemToStorage('accessToken', res.accessToken);
      }),
      catchError((err) => {
        this.logout();

        console.error('Fehler beim Token-Refresh:', err);
        return throwError(() => err);
      })
    );
  }

  async login(email: string, password: string): Promise<User> {
    // HTTP-Request an den Server senden, mit `credentials: 'include'`, um Cookies zu setzen
    const login$ = this.http.post<ILogRes>(
      UserEnum.login,
      {
        email,
        password
      },
      { withCredentials: true }
    ); // <-- Wichtig: `withCredentials` einschalten für cookie Sendungen

    // Wandle den Observable-Stream in ein Promise um
    const authPayload = await firstValueFrom(login$);

    const { user, accessToken } = authPayload;

    // Setze den Benutzerstatus in deinem Signal (z. B. Zustandsspeicher)
    this._userSignal.set(user);
    this.saveItemToStorage('accessToken', accessToken);

    return user;
  }

  async logout(): Promise<void> {
    // Sende einen Logout-Request an den Server, damit das Cookie gelöscht wird
    const logout$ = this.http.post<void>(UserEnum.logout, { withCredentials: true });

    await firstValueFrom(logout$);

    // Aktualisiere den Benutzerstatus
    this._userSignal.set(null);

    // Löschen des AccessTokens
    this.removeItemFromStorage('accessToken');

    // Navigiere den Benutzer zur Login-Seite
    await this._router.navigateByUrl('/login');
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
    return null;
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
  accessToken: string;
}

interface IRefAccToken {
  // Refresh Access Token
  accessToken: string;
}
