export interface IUser {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  isBanned: boolean;
  isActivated: boolean;
}
