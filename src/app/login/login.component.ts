import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
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
        this._authService.showMessage('Enter an email and password');
        return;
      }
      const log = await this._authService.login(email, password);
      if (log) {
        await this._router.navigate([''], { replaceUrl: true });
      }

      return;
    } catch (err) {
      console.error(err);
      this._authService.showMessage('Login failed, please try again');
    }
  }
}
