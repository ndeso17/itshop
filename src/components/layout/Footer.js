import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section brand-section">
            <h3 className="footer-brand">ITShop</h3>
            <p className="brand-desc">{t("footer.brandDesc")}</p>
            <div className="social-links">
              <a href="#" className="social-icon">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-icon">
                <Instagram size={20} />
              </a>
              <a href="#" className="social-icon">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">{t("footer.shop")}</h4>
            <ul className="footer-links">
              <li>
                <Link to="/products?category=Women">{t("common.women")}</Link>
              </li>
              <li>
                <Link to="/products?category=Men">{t("common.men")}</Link>
              </li>
              <li>
                <Link to="/products?category=Kids">{t("common.kids")}</Link>
              </li>
              <li>
                <Link to="/products?category=Sports">{t("common.sports")}</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">{t("footer.help")}</h4>
            <ul className="footer-links">
              <li>
                <a href="#">{t("footer.customerService")}</a>
              </li>
              <li>
                <a href="#">{t("footer.shippingInfo")}</a>
              </li>
              <li>
                <a href="#">{t("footer.returns")}</a>
              </li>
              <li>
                <a href="#">{t("footer.faq")}</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">{t("footer.contact")}</h4>
            <ul className="footer-contact">
              <li>
                <MapPin size={18} />
                <span>123 Fashion St, Jakarta, Indonesia</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+62 812 3456 7890</span>
              </li>
              <li>
                <Mail size={18} />
                <span>support@itshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} ITShop. {t("footer.copyright")}
          </p>
        </div>
      </div>

      <style>{`
        .footer {
            background-color: #222;
            color: #fff;
            padding: 60px 0 20px;
            margin-top: auto;
        }
        .footer-content {
            display: grid;
            grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
            gap: 40px;
            margin-bottom: 40px;
        }
        .footer-brand {
            font-size: 24px;
            margin-bottom: 20px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .brand-desc {
            color: #aaa;
            line-height: 1.6;
            margin-bottom: 25px;
            font-size: 14px;
        }
        .social-links {
            display: flex;
            gap: 15px;
        }
        .social-icon {
            color: #fff;
            transition: color 0.2s;
        }
        .social-icon:hover {
            color: var(--gold);
        }
        
        .footer-title {
            font-size: 16px;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .footer-links li {
            margin-bottom: 12px;
        }
        .footer-links a {
            color: #aaa;
            font-size: 14px;
            transition: color 0.2s;
        }
        .footer-links a:hover {
            color: #fff;
        }
        
        .footer-contact li {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 15px;
            color: #aaa;
            font-size: 14px;
        }
        
        .footer-bottom {
            border-top: 1px solid #333;
            padding-top: 20px;
            text-align: center;
            color: #777;
            font-size: 13px;
        }
        
        @media (max-width: 768px) {
            .footer-content {
                grid-template-columns: 1fr;
                gap: 40px;
            }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
