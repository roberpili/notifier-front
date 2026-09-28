import Link from "next/link";
import "@/app/styles/goto-login.css";

export const GotoLoginComponent = () => {
  return (
    <p className="goto-login">
      Already have an account? <Link href="/login">Login</Link>
    </p>
  );
};
