import type { StatusType } from "./payment";

export type AuthFormState = {
  error: string | null;
};

export type RegisterFormState = {
  error: string | null;
  success: string | null;
};

export type PaymentResultState = {
  message: string;
  type: StatusType;
};
