import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <span>Unlock full access to continue your Bible study journey!</span>
        <button className="btn btn-primary">Subscribe</button>
        <button className="btn btn-secondary">Gift a Subscription</button>
      </div>
    </footer>
  );
}
