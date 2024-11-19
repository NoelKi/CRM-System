import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private _loginService = inject(LoginService);
  fb = inject(FormBuilder);

  form = this.fb.group({
    email: [''],
    password: ['']
  });

  onLogin(): void {
    try {
      const { email, password } = this.form.value;
      if (!email || !password) {
        this._loginService.showMessage('Enter an email and password');
      }
    } catch (err) {
      console.error(err);
      this._loginService.showMessage('Login failed, please try again');
    }
  }
}
