import Image from "next/image";
import Link from "next/link";

export const HeroComponent = () => {
  return (
    <div className="hero-container">
      <div className="hero">
        {/* text content section */}
        <div className="hero-content">
          <h1 className="hero-title">
            Track your payments with <span>Notifier</span>
          </h1>

          <p className="hero-description">
            Keep an eye on your upcoming payments. <br />
            Track your bills, subscriptions, and purchases.
          </p>

          <Link href="/register" className="hero-button">
            Sign Up Now
          </Link>
        </div>

        {/* hero image section */}
        <div className="hero-image-container">
          <Image
            src="/assets/images/hero.png"
            alt="Hero image"
            width={600}
            height={600}
            className="hero-image"
            priority
          />
        </div>
      </div>
    </div>
  );
};
