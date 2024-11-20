import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
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
  private _authService = inject(AuthService);
  private _router = inject(Router);
  fb = inject(FormBuilder);

  form = this.fb.group({
    email: [''],
    password: ['']
  });

  async onLogin(): Promise<void> {
    try {
      const { email, password } = this.form.value;
      if (!email || !password) {
        this._loginService.showMessage('Enter an email and password');
        return;
      }
      await this._authService.login(email, password);
      await this._router.navigate(['/user']);
    } catch (err) {
      console.error(err);
      this._loginService.showMessage('Login failed, please try again');
    }
  }
}
