import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://medi-b-backend.onrender.com";

const VerifyPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get("session_id");

      if (location.pathname === "/appointment/cancel") {
        if (!cancelled) {
          navigate("/appointments?payment_status=cancelled", {
            replace: true,
          });
        }
        return;
      }

      if (!sessionId) {
        if (!cancelled) {
          navigate("/appointments?payment_status=failed", {
            replace: true,
          });
        }
        return;
      }

      try {
        await axios.get(`${API_BASE}/api/appointments/confirm`, {
          params: { session_id: sessionId },
          timeout: 15000,
        });

        if (!cancelled) {
          navigate("/appointments?payment_status=success", {
            replace: true,
          });
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          navigate("/appointments?payment_status=failed", {
            replace: true,
          });
        }
      }
    };

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [location, navigate]);

  return <div>Verifying payment...</div>;
};

export default VerifyPaymentPage;