export class User {
  firstName: string;
  lastName: string;
  birthDate: Date;
  street: string;
  houseNumber: number;
  city: string;
  postalCode: string;
  email: string;

  constructor(obj?: any) {
    this.firstName = obj ? obj.firstName : '';
    this.lastName = obj ? obj.lastName : '';
    this.birthDate = obj ? obj.birthDate : '';
    this.street = obj ? obj.street : '';
    this.city = obj ? obj.city : '';
    this.postalCode = obj ? obj.postalCode : '';
    this.email = obj ? obj.email : '';
    this.houseNumber = obj ? obj.houseNumber : '';
  }
}
