import type { footerConfig } from "@/constants/footer";

export type FooterProps = typeof footerConfig;

export const FooterComponent = ({
  aboutTitle,
  aboutText,
  links,
  socials,
  copyright,
}: FooterProps) => {
  return (
    <footer className="footer">
      {/* about me */}
      <div className="footer-content">
        <section>
          <h2 className="footer-title">{aboutTitle}</h2>
          <p className="footer-text">{aboutText}</p>
        </section>

        {/* links */}
        <section className="footer-links">
          <h2 className="footer-title">Links</h2>
          <ul>
            {links.map(({ label, href }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* socials */}
        <section className="footer-socials">
          <h2 className="footer-title">Socials</h2>
          <ul>
            {socials.map(({ label, href, iconClass }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <i className={`${iconClass} footer-social-icon`} />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="footer-copyright">{copyright}</div>
    </footer>
  );
};
