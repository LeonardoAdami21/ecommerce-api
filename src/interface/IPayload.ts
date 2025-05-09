export interface IPayload {
  name?: string;
  email: string;
  sub: string;
  roles: string[];
  password?: string;
  id?: string;
  iat?: number;
  exp?: number;
}
