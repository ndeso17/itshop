import React from "react";
import { Link } from "react-router-dom";
import {
  IoLogoTwitter,
  IoLogoInstagram,
  IoLogoFacebook,
} from "react-icons/io5";

const Footer = () => {
  return (
    <footer className="bg-navbar pt-5 pb-3 border-top mt-auto d-none d-md-block">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <h5
              className="text-uppercase mb-4 fw-bold"
              style={{ letterSpacing: "2px" }}
            >
              ITShop
            </h5>
            <p className="text-secondary">
              Premium fashion destination for modern lifestyle. Discover the
              latest trends and collections curated just for you.
            </p>
          </div>

          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h6 className="text-uppercase mb-4 fw-bold font-monospace">Shop</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link
                  to="/products?category=Wanita"
                  className="text-secondary text-decoration-none hover-primary"
                >
                  Women
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/products?category=Pria"
                  className="text-secondary text-decoration-none hover-primary"
                >
                  Men
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/products?category=Anak"
                  className="text-secondary text-decoration-none hover-primary"
                >
                  Kids
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h6 className="text-uppercase mb-4 fw-bold font-monospace">
              Company
            </h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link
                  to="/about"
                  className="text-secondary text-decoration-none hover-primary"
                >
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/contact"
                  className="text-secondary text-decoration-none hover-primary"
                >
                  Contact
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/careers"
                  className="text-secondary text-decoration-none hover-primary"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <h6 className="text-uppercase mb-4 fw-bold font-monospace">
              Newsletter
            </h6>
            <p className="text-secondary mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                aria-label="Recipient's email"
              />
              <button className="btn btn-primary" type="button">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
          <p className="text-secondary small mb-0">
            &copy; {new Date().getFullYear()} ITShop. All rights reserved.
          </p>
          <ul className="list-unstyled d-flex mb-0">
            <li className="ms-3">
              <a className="link-secondary" href="#">
                <IoLogoTwitter size={20} />
              </a>
            </li>
            <li className="ms-3">
              <a className="link-secondary" href="#">
                <IoLogoInstagram size={20} />
              </a>
            </li>
            <li className="ms-3">
              <a className="link-secondary" href="#">
                <IoLogoFacebook size={20} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
