export class Login {
  password: string;
  email: string;

  constructor(obj?: Login) {
    this.password = obj ? obj.email : '';
    this.email = obj ? obj.email : '';
  }
}
