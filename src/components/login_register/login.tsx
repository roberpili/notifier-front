"use client";

import { useActionState } from "react";
import { ForgotPasswordComponent } from "./forgot_password";
import { GotoRegisterComponent } from "./goto_register";
import { GoogleAuthButton } from "./google_auth";
import { InputComponent } from "../input";
import { Button } from "../button";
import { StatusMessageComponent } from "../message";
import { INITIAL_AUTH_STATE } from "@/constants/auth";
import { loginAction } from "@/actions/auth";
import Image from "next/image";
import "@/app/styles/login.css";

export const LoginComponent = () => {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    INITIAL_AUTH_STATE,
  );

  return (
    <div className="login">
      <div className="login-card">
        <h1>Login Page</h1>

        <form action={formAction} className="login-form">
          {/* email field */}
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <InputComponent
              name="email"
              id="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* password field */}
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <InputComponent
              name="password"
              id="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <ForgotPasswordComponent />

          {/* login button */}
          <Button type="submit" disabled={isPending} className="login-button">
            {isPending ? "Logging In..." : "Login"}
          </Button>
        </form>

        {/* divider */}
        <div className="login-divider" aria-hidden="true">
          <span />
          <span>OR</span>
          <span />
        </div>

        {/* google login */}
        <GoogleAuthButton text="signin_with" />

        {state.error && (
          <StatusMessageComponent message={state.error} type="error" />
        )}

        <GotoRegisterComponent />
      </div>

      <Image
        src="/assets/images/login.jpg"
        alt="Logo"
        width={600}
        height={400}
        className="login-image"
      />
    </div>
  );
};
