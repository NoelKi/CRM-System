import { User } from '../models/login.model';

export const users: User[] = [
  new User({
    email: 'kieran.noel@icloud.com',
    pictureUrl: '',
    isAdmin: true
  }),
  new User({
    email: 'paul@panther.de',
    pictureUrl: '',
    isAdmin: false
  })
];
