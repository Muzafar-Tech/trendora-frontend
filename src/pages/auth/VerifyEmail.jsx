import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import axios from "../../utils/axios";
import authBg from "../../assets/auth-bg.jpeg";
import { Icon } from "@iconify/react";
import navbarLogo from "../../assets/navbar-logo.png";
export default function VerifyEmail() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login: setUser } = useAuth();

  // userId previous page se aaya
  const userId = location.state?.userId;

  const handleChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);

    // Auto focus next
    if (val && idx < 5) {
      document.getElementById(`code-${idx + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      document.getElementById(`code-${idx - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pasted)) {
      const newCode = pasted.split("");
      setCode(newCode.concat(Array(6 - newCode.length).fill("")));
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) return setError("Please enter 6-digit code");

    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/auth/verify-email", {
        userId,
        code: fullCode,
      });

      // Login karo
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      // Role ke hisab se redirect
      if (res.data.role === "brand") navigate("/brand/dashboard");
      else if (res.data.role === "admin") navigate("/admin/dashboard");
      else navigate("/creator/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await axios.post("/auth/resend-code", { userId });
      setSuccess("New code sent to your email!");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div
        className="hidden lg:flex w-1/2 relative flex-col justify-between p-10"
        style={{
          backgroundImage: `url(${authBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* <div className="absolute inset-0 bg-primary/60" /> */}
        {/* <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <span className="text-primary font-black text-lg">T</span>
            </div>
            <span className="text-white font-black text-xl">TRENDORA</span>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            One step<br />
            <span className="text-purple-200">away!</span>
          </h2>
          <p className="text-purple-100 text-sm max-w-xs">
            Check your email for the 6-digit verification code.
          </p>
        </div>
        <div className="relative z-10 flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full bg-white ${i === 0 ? 'w-6' : 'w-1.5'} opacity-60`} />
          ))}
        </div> */}
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-purple-50">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <Link
              to="/"
              className="flex items-center gap-1 transition-transform hover:scale-105"
            >
              <img
                src={navbarLogo}
                alt="Trendora Logo"
                className="w-12 h-12 object-contain"
              />
              <span className="text-2xl font-extrabold tracking-tight text-purple-700">
                Trendora
              </span>
            </Link>
          </div>

          <div
            className="
    bg-white
    rounded-[32px]
    p-8
    md:p-12
    border
    border-purple-100
    shadow-[0_25px_80px_rgba(124,58,237,0.12)]
  "
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon
                  icon="mdi-light:email"
                  className="text-3xl text-purple-600"
                />
              </div>
              <h1 className="text-2xl font-black text-secondary mb-2">
                Verify Your Email
              </h1>
              <p className="text-sm text-muted">
                Enter the 6-digit code sent to your email address.
              </p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2">
                <Icon
                  icon="solar:danger-triangle-bold"
                  className="text-lg flex-shrink-0"
                />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-center gap-2">
                <Icon
                  icon="solar:check-circle-bold"
                  className="text-lg flex-shrink-0"
                />
                <span>{success}</span>
              </div>
            )}

            {/* Code Input */}
            <div
              className="flex gap-3 justify-center mb-6"
              onPaste={handlePaste}
            >
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  id={`code-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-12 h-14 text-center text-xl font-black border-2 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-colors"
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={loading || code.join("").length !== 6}
              className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors shadow-purple text-sm disabled:opacity-60 disabled:cursor-not-allowed mb-4"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-400">
                  Email Verification
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-primary font-bold hover:text-primary-dark disabled:opacity-60"
                >
                  {resending ? "Sending..." : "Resend Code"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
