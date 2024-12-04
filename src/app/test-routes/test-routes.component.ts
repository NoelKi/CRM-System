import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-test-routes',
  standalone: true,
  imports: [],
  template: '<button (click)="triggerTest()">Get 401</button>',
  styles: ''
})
export class TestRoutesComponent {
  http = inject(HttpClient);
  private _authService = inject(AuthService);
  constructor() {}

  triggerTest() {
    this._authService.refreshAccessToken();
    // this.http
    //   .get(UserEnum.test)
    //   .pipe(
    //     catchError((error) => {
    //       // Hier wird der Fehler verarbeitet
    //       return of(null);
    //     })
    //   )
    //   .subscribe();
  }
}
