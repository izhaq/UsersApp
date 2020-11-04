export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  mapLink?: string;
  addressDescription?: string;
  phone: string;
  website: string;
  company: Company;
  expanded?: boolean;
}

export interface Geo {
  lat: number;
  lng: number;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface Comment {
  userId: string;
  id: number;
  title: string;
  body: string;
}
