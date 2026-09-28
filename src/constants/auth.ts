import type {
  AuthFormState,
  PaymentResultState,
  RegisterFormState,
} from "@/types/auth";

export const INITIAL_AUTH_STATE: AuthFormState = { error: null };

export const INITIAL_REGISTER_STATE: RegisterFormState = {
  error: null,
  success: null,
};

export const INITIAL_PAYMENT_RESULT: PaymentResultState | null = null;
