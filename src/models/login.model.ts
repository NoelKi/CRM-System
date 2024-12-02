export class User {
  user_id?: string;
  email: string;
  pictureUrl: string;
  isAdmin: boolean;

  constructor(obj?: User) {
    this.user_id = obj ? obj.user_id : '';
    this.email = obj ? obj.email : '';
    this.pictureUrl = obj ? obj.pictureUrl : '';
    this.isAdmin = obj ? obj.isAdmin : false;
  }
}
