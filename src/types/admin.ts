export type AdminRole = "admin" | "user";

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role?: AdminRole;
}

export type AdminLoginPayload = {
  email: string;
  password: string;
};

export type AdminFormState = {
  error: string | null;
};

export type AdminDeleteResult = {
  error: string | null;
};

export interface AdminLoginResponse {
  user: {
    id: number;
    email: string;
    role: string;
  };
  setCookie: string;
}
