import Link from "next/link";
import { Button } from "./button";
import Image from "next/image";
import { getSession } from "@/lib/session-cookie";
import { logoutAction } from "@/actions/auth";
import { NavbarLinks } from "@/constants/navLinks";
import "@/app/styles/navbar.css";

export const NavbarComponent = async () => {
  const session = await getSession();

  return (
    <nav className="navbar">
      {/* logo section */}
      <div>
        <Link href="/" className="navbar-logo">
          <Image
            src="/assets/images/linux.svg"
            alt="Notifier"
            width={60}
            height={60}
          />
          <span>Notifier</span>
        </Link>
      </div>

      {/* link section */}
      <div className="navbar-links">
        <ul>
          {NavbarLinks.map((link) => (
            <li key={link.id}>
              {link.external ? (
                <a href={link.to} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              ) : (
                <Link href={link.to}>{link.label}</Link>
              )}
            </li>
          ))}

          {session && (
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
          )}
        </ul>
      </div>

      {/* button section */}
      <div className="navbar-action">
        {!session ? (
          <Link href="/login" className="primary-button">
            Log In
          </Link>
        ) : (
          <form action={logoutAction}>
            <Button type="submit" className="primary-button">
              Log out
            </Button>
          </form>
        )}
      </div>
    </nav>
  );
};
