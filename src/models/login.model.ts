export class User {
  password: string;
  email: string;
  pictureUrl: string;

  constructor(obj?: User) {
    this.password = obj ? obj.password : '';
    this.email = obj ? obj.email : '';
    this.pictureUrl = obj ? obj.pictureUrl : '';
  }
}
