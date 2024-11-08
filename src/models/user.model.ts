export class User {
  _id: string;
  firstName: string;
  lastName: string;
  birthDate?: Date;
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  email: string;
  profilPicSrc: string;

  constructor(obj?: User) {
    this._id = obj?._id || '';
    this.firstName = obj ? obj.firstName : '';
    this.lastName = obj ? obj.lastName : '';
    this.birthDate = obj?.birthDate;
    this.street = obj ? obj.street : '';
    this.city = obj ? obj.city : '';
    this.postalCode = obj ? obj.postalCode : '';
    this.email = obj ? obj.email : '';
    this.houseNumber = obj ? obj.houseNumber : '';
    this.profilPicSrc = obj ? obj.profilPicSrc : '';
  }
}
