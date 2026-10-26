import type { AdminFormState } from "@/types/admin";

export const ADMIN_SESSION_COOKIE = "admin_session_token";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;
export const INITIAL_ADMIN_AUTH_STATE: AdminFormState = { error: null };
