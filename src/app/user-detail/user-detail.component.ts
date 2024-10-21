import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
  userId: string | null = '';

  user!: User | undefined;

  private _route = inject(ActivatedRoute);
  private _userService = inject(UserService);

  // constructor(private route: ActivatedRoute) {}
  constructor() {}

  ngOnInit(): void {
    // this.route.paramMap.subscribe((paramMap) => {
    //   this.userId = paramMap.get('id');
    //   console.log('Got the ID: ' + this.userId);
    // });
    const paramId = this._route.snapshot.paramMap.get('id');
    if (paramId === null) {
      return;
    }
    this.user = this._userService.getUser(paramId);
  }
}
