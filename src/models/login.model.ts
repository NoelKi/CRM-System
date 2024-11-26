export class User {
  email: string;
  pictureUrl: string;
  isAdmin: boolean;

  constructor(obj?: User) {
    this.email = obj ? obj.email : '';
    this.pictureUrl = obj ? obj.pictureUrl : '';
    this.isAdmin = obj ? obj.isAdmin : false;
  }
}
