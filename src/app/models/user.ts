interface IUser {
  userId: number;
  Email: string;
  type: string;
  registerDate: Date;
  lastLogin: Date;
}

export class User implements IUser {
  userId: number;
  Email: string;
  type: string;
  registerDate: Date;
  lastLogin: Date;

  constructor(userId: number, Email: string, type: string, registerDate: Date, lastLogin: Date) {
    this.userId = userId;
    this.Email = Email;
    this.type = type;
    this.registerDate = registerDate;
    this.lastLogin = lastLogin;
  }
}
