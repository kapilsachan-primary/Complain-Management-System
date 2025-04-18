import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoBackHome = () => {
    navigate("/user/dashboard");
  };

  return (
    <div className="not-found-container">
      <div className="max-w-3xl">
        <h1 className="not-found-heading">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-message">
          The page you are looking for doesn't exist or has been moved. Let's get
          you back to safety.
        </p>
        <button onClick={handleGoBackHome} className="not-found-button">
          Go Back Home
        </button>
      </div>
    </div>
  );
}
