export interface AdminUser {
  id: number;
  email: string;
  name: string;
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
