import { User } from '../models/login.model';

export const users: User[] = [
  new User({
    email: 'kieran.noel@icloud.com',
    password: 'test123',
    pictureUrl: ''
  }),
  new User({
    email: 'paul@panther.de',
    password: '123',
    pictureUrl: ''
  })
];
