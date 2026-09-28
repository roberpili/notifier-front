"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GotoLoginComponent } from "./goto_login";
import { GoogleAuthButton } from "./google_auth";
import { InputComponent } from "../input";
import { TermsAndConditionsComponent } from "./terms_conditions";
import { StatusMessageComponent } from "../message";
import { Button } from "../button";
import { INITIAL_REGISTER_STATE } from "@/constants/auth";
import { registerAction } from "@/actions/auth";
import "@/app/styles/register.css";

const SUCCESS_REDIRECT_DELAY = 3000;

export function RegisterComponent() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    INITIAL_REGISTER_STATE,
  );
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!state.success) return;

    const timeout = setTimeout(() => router.push("/"), SUCCESS_REDIRECT_DELAY);
    return () => clearTimeout(timeout);
  }, [state.success, router]);

  return (
    <div className="register">
      <div className="register-container">
        <div className="register-card">
          {/* left */}
          <section className="register-intro">
            <h2>Welcome</h2>
            <p>An easy to use app to keep an eye on your upcoming payments.</p>
          </section>

          {/* right */}
          <section className="register-form-section">
            <h1>Register</h1>
            <p>Please fill out the form below to register.</p>

            <form action={formAction}>
              <InputComponent
                name="username"
                type="text"
                placeholder="Username"
                className="register-input"
                defaultValue={state.values?.username}
                required
              />

              <InputComponent
                name="email"
                type="email"
                placeholder="Email"
                className="register-input"
                defaultValue={state.values?.email}
                required
              />

              <InputComponent
                name="password"
                type="password"
                placeholder="Password"
                className="register-input"
                required
              />

              <InputComponent
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className="register-input"
                required
              />

              <TermsAndConditionsComponent
                name="terms"
                checked={termsAccepted}
                onChange={setTermsAccepted}
              />

              {state.error && (
                <StatusMessageComponent message={state.error} type="error" />
              )}

              <StatusMessageComponent message={state.success} type="success" />

              <Button
                type="submit"
                disabled={isPending}
                className="register-submit"
              >
                {isPending ? "Registering..." : "Register"}
              </Button>

              <GotoLoginComponent />
            </form>

            {/* divider */}
            <div className="register-divider" aria-hidden="true">
              <span />
              <span>OR</span>
              <span />
            </div>

            {/* google auth */}
            <GoogleAuthButton text="signup_with" theme="filled_black" />
          </section>
        </div>
      </div>
    </div>
  );
}
