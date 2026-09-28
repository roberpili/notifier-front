export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  id: number;
  email: string;
  token: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};
