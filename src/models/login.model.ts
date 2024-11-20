export class User {
  password: string;
  email: string;
  profilPicSrc: string;

  constructor(obj?: User) {
    this.password = obj ? obj.password : '';
    this.email = obj ? obj.email : '';
    this.profilPicSrc = obj ? obj.profilPicSrc : '';
  }
}