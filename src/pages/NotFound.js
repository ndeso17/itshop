import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found-page container">
      <div className="content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary">
          Go to Homepage
        </Link>
      </div>
      <style>{`
        .not-found-page {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            text-align: center;
        }
        .content h1 {
            font-size: 120px;
            font-weight: 700;
            color: var(--sage);
            line-height: 1;
            margin-bottom: 20px;
        }
        .content h2 {
            font-size: 24px;
            margin-bottom: 15px;
            color: var(--darker);
        }
        .content p {
            color: #666;
            margin-bottom: 30px;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
