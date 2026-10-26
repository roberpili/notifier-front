"use client";

import { useActionState } from "react";
import { adminLoginAction } from "@/actions/admin";
import { Button } from "@/components/button";
import { InputComponent } from "@/components/input";
import { StatusMessageComponent } from "@/components/message";
import { INITIAL_ADMIN_AUTH_STATE } from "@/constants/admin";

export const AdminLoginComponent = () => {
  const [state, formAction, isPending] = useActionState(
    adminLoginAction,
    INITIAL_ADMIN_AUTH_STATE,
  );

  return (
    <div className="admin-login">
      <div className="admin-card admin-login-card">
        <h1>Admin Login</h1>

        <form action={formAction} className="admin-form">
          <div className="admin-field">
            <label htmlFor="email">Email</label>
            <InputComponent
              id="email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="admin-field">
            <label htmlFor="password">Password</label>
            <InputComponent
              id="password"
              name="password"
              type="password"
              placeholder="Enter your admin password"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="primary-button admin-submit"
          >
            {isPending ? "Logging in..." : "Log in"}
          </Button>

          {state.error && (
            <StatusMessageComponent message={state.error} type="error" />
          )}
        </form>
      </div>
    </div>
  );
};
