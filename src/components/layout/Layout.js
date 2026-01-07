import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomNav from "./BottomNav";

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      {/* 
        Main Content 
        - Padding top to account for fixed header (approx 130px for double nav, 60px for mobile single nav) 
        - Flex-grow to push footer down
      */}
      <main className="flex-grow-1" style={{ paddingTop: "130px" }}>
        {/* Mobile top padding adjustment via media query in index.css or style block */}
        <div className="d-md-none" style={{ height: "70px" }}></div>
        {/* The spacer above helps, or we can use pt-classes. 
            Navbar height: ~60px mobile, ~110px desktop.
        */}

        {children}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Layout;
