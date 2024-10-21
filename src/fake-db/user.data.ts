import { User } from "../models/user.model";

export const users: User[] = [
  new User({
      "firstName": "Kieran",
      "lastName": "Mai",
      "birthDate": new Date( "2024-10-16T22:00:00.000Z"),
      "street": "",
      "houseNumber": "",
      "city": "Berlin",
      "postalCode": "12161",
      "email": "kieran.noel@icloud.com"
  }),
  new User({
      "firstName": "Amadeus",
      "lastName": "Scherkenbach",
      "birthDate": new Date( "2024-10-16T22:00:00.000Z"),
      "street": "",
      "houseNumber": "",
      "city": "Berlin",
      "postalCode": "12161",
      "email": "ama.noel@icloud.com"
  })
]
