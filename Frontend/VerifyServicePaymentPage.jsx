import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000";

const VerifyServicePaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get("session_id");

      if (location.pathname === "/service/cancel") {
        if (!cancelled) {
          navigate("/services?payment_status=cancelled", {
            replace: true,
          });
        }
        return;
      }

      if (!sessionId) {
        if (!cancelled) {
          navigate("/services?payment_status=failed", {
            replace: true,
          });
        }
        return;
      }

      try {
        await axios.get(`${API_BASE}/api/service-appointments/confirm`, {
          params: { session_id: sessionId },
          timeout: 15000,
        });

        if (!cancelled) {
          navigate("/services?payment_status=success", {
            replace: true,
          });
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          navigate("/services?payment_status=failed", {
            replace: true,
          });
        }
      }
    };

    verifyServicePayment();

    return () => {
      cancelled = true;
    };
  }, [location, navigate]);

  return <div>Verifying payment...</div>;
}

export default VerifyServicePaymentPage
