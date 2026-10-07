import Logo from "../Logo/Logo";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <Logo size={36} />
          <span>Weasleys' Wizard Wheezes</span>
        </div>

        <p className="footer-copy">© 2026 Weasleys' Wizard Wheezes</p>
      </div>
    </footer>
  );
};

export default Footer;
