import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor() {}

  showMessage(message: string): void {
    console.log(message);
  }
}
