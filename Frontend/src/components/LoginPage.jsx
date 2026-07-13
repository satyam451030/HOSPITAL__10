import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { loginPageStyles, toastStyles } from "../assets/dummyStyles";
import logo from "../assets/Logo1.png";

const API_BASE = "https://medi-b-backend.onrender.com";
const STORAGE_KEY = "doctorToken_v1";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password", {
        style: toastStyles.errorToast,
      });
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/api/doctors/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(json?.message || "Login failed", { duration: 4000 });
        setBusy(false);
        return;
      }
      const token = json?.token || json?.data?.token;
      if (!token) {
        toast.error("Authentication token missing");
        setBusy(false);
        return;
      }

      const doctorId =
        json?.data?._id || json?.doctor?._id || json?.data?.doctor?._id;
      if (!doctorId) {
        toast.error("Doctor ID missing from server response");
        setBusy(false);
        return;
      }

      localStorage.setItem(STORAGE_KEY, token);
      window.dispatchEvent(
        new StorageEvent("storage", { key: STORAGE_KEY, newValue: token }),
      );
      toast.success("Login successful — redirecting...", {
        style: toastStyles.successToast,
      });
      setTimeout(() => {
        navigate(`/doctor-admin/${doctorId}`);
      }, 700);
    } catch (err) {
      console.error("login error", err);
      toast.error("Network error during login");
      setBusy(false);
    }
  };

  return (
    <div className={loginPageStyles.mainContainer}>
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Decorative Blur Blobs for Rich Aesthetics */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-orange-300/30 blur-3xl animate-pulse duration-[6000ms] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-amber-300/30 blur-3xl animate-pulse duration-[8000ms] pointer-events-none"></div>

      {/* Back button */}
      <Link to="/" className={loginPageStyles.backButton}>
        <ArrowLeft className={loginPageStyles.backButtonIcon} />
        <span>Back to Home</span>
      </Link>

      {/* Login card */}
      <div className={`${loginPageStyles.loginCard} border-2 border-white/50 backdrop-blur-2xl shadow-orange-100`}>
        {/* Logo */}
        <div className={loginPageStyles.logoContainer}>
          <img src={logo} alt="Medi-B Logo" className={loginPageStyles.logo} />
        </div>

        {/* Header */}
        <h2 className={loginPageStyles.title}>Doctor Portal</h2>
        <p className={loginPageStyles.subtitle}>Sign in to manage your schedule and appointments</p>

        {/* Form */}
        <form onSubmit={handleLogin} className={loginPageStyles.form}>
          {/* Email field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-orange-800 tracking-wider uppercase ml-1 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-600/70" />
              <input
                type="email"
                placeholder="doctor@medib.com"
                className={`${loginPageStyles.input} pl-12 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all duration-300 placeholder:text-gray-400`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={busy}
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-orange-800 tracking-wider uppercase ml-1 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-600/70" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`${loginPageStyles.input} pl-12 pr-12 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all duration-300 placeholder:text-gray-400`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy}
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-600/70 hover:text-orange-800 transition-colors p-1"
                onClick={() => setShowPassword(!showPassword)}
                disabled={busy}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={busy}
            className={`${loginPageStyles.submitButton} mt-6 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-orange-200 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {busy ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
