export enum Role {
  REGULAR = 'regular',
  OWNER = 'owner',
  ADMIN = 'admin',
}

export class User {
  uid: string;
  displayName: string;
  role: Role;
  email: string;
}
