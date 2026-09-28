import Link from "next/link";
import "@/app/styles/goto-register.css";

export const GotoRegisterComponent = () => {
  return (
    <p className="goto-register">
      Not a user? <Link href="/register">Create an account</Link>
    </p>
  );
};
