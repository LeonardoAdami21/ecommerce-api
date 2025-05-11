export interface IPayload {
  name?: string;
  email: string;
  sub?: number;
  roles: string[];
  password?: string;
  id?: number;
  iat?: number;
  exp?: number;
}
