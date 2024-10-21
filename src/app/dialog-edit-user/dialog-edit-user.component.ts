import { Component } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dialog-edit-user',
  standalone: true,
  imports: [],
  templateUrl: './dialog-edit-user.component.html',
  styleUrl: './dialog-edit-user.component.scss'
})
export class DialogEditUserComponent {
  user!: User;
}
