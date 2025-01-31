export type RequestUser = {
  user: User;
};

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  refreshToken?: string;
}
