export interface IPayload {
  name?: string;
  email: string;
  roles: string;
  password?: string;
  id?: string;
  iat?: number;
  exp?: number;
}
