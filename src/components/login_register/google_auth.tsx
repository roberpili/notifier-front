"use client";

import { googleAuth } from "@/services/auth_google";
import { useEffect, useRef } from "react";
import "@/app/styles/google-auth.css";

type CredentialResponse = {
  credential?: string;
  select_by?: string;
};

interface Props {
  text?: "signin_with" | "signup_with";
  theme?: "outline" | "filled_black";
}

export const GoogleAuthButton = ({
  text = "signin_with",
  theme = "outline",
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
      return;
    }

    const handleCredentialResponse = async (response: CredentialResponse) => {
      const idToken = response.credential;
      if (!idToken) return;

      try {
        const data = await googleAuth(idToken);
        console.log(data.email, data.token);
      } catch (error) {
        console.error(error);
      }
    };

    const initializeGoogle = () => {
      const container = containerRef.current;

      if (!container || !window.google) return;

      container.innerHTML = "";

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(container, {
        theme,
        size: "large",
        width: "100%",
        locale: "en",
        text,
      });
    };

    if (window.google) {
      initializeGoogle();
      return;
    }

    const script = document.querySelector<HTMLScriptElement>(
      'script[src*="accounts.google.com/gsi/client"]',
    );
    if (!script) {
      const newScript = document.createElement("script");
      newScript.src = "https://accounts.google.com/gsi/client";
      newScript.async = true;
      newScript.defer = true;
      newScript.addEventListener("load", initializeGoogle);
      document.head.appendChild(newScript);

      return () => {
        newScript.removeEventListener("load", initializeGoogle);
      };
    }

    script.addEventListener("load", initializeGoogle);

    return () => {
      script.removeEventListener("load", initializeGoogle);
    };
  }, [clientId, text, theme]);

  return <div ref={containerRef} className="google-auth-button" />;
};
