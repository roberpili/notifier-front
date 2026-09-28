import Link from "next/link";
import "@/app/styles/forgot-password.css";

export const ForgotPasswordComponent = () => {
  return (
    <div className="forgot-password">
      <Link href="/forgot-password">Forgot password?</Link>
    </div>
  );
};
