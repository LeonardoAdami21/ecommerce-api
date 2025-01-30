export type RequestUser = {
  user: User;
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  refreshToken?: string;
}
