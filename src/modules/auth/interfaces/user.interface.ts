export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export interface LoginResponse {
  access_token: string;
  user: AuthenticatedUser;
}
