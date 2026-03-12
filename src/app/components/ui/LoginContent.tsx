// src/app/components/ui/LoginContent.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import FloatingInput from "./FloatingInputProps";
import Divider from "./Divider";
import {
  ArrowLeft,
  CircleAlertIcon,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  Mail,
  X,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { getPostLoginRedirect } from "@/lib/utils/redirectLogic";

interface VerifyOtpResponse {
  verified: boolean;
  message?: string;
}

interface LoginContentProps {
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
  redirectPath?: string;
  onSuccess?: () => void;
}

export default function LoginContent({
  isLoginOpen,
  setIsLoginOpen,
  redirectPath,
  onSuccess,
}: LoginContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1); // 1: Login/Register, 2: OTP, 3: Registration Success
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [errorNewPassword, setErrorNewPassword] = useState("");
  const [errorConfirmNewPassword, setErrorConfirmNewPassword] = useState("");
  const [errorOtp, setErrorOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [forgotPasswordFlow, setForgotPasswordFlow] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Reset Success
  const [resetVerified, setResetVerified] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // Track if OTP has been sent

  const {
    passwordLogin: authPasswordLogin,
    register: authRegister,
    sendOtp: authSendOtp,
    verifyOtp: authVerifyOtp,
    forgotPassword: authForgotPassword,
    verifyResetOtp: authVerifyResetOtp,
    resetPassword: authResetPassword,
  } = useAuth();

  const otpRefs = Array.from({ length: 4 }, () =>
    useRef<HTMLInputElement>(null),
  );

  // Build callback URL with current path and query params
  const getCallbackUrl = () => {
    if (redirectPath) return redirectPath;

    // Get all current query parameters
    const params = new URLSearchParams(searchParams.toString());
    const queryString = params.toString();

    // Return current path with query string
    return queryString ? `${pathname}?${queryString}` : pathname;
  };

  /* ================= VALIDATION FUNCTIONS ================= */
  const validateEmail = (email: string) => {
    if (!email || email.trim() === "") {
      return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    return "";
  };

  const validatePassword = (password: string) => {
    if (!password || password.trim() === "") {
      return "Password is required";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  };

  /* ================= HANDLE CLOSE ================= */
  const handleClose = () => {
    setIsLoginOpen(false);
    // Reset all states
    setStep(1);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setForgotPasswordEmail("");
    setOtp(["", "", "", ""]);
    setErrorEmail("");
    setErrorPassword("");
    setErrorConfirmPassword("");
    setErrorNewPassword("");
    setErrorConfirmNewPassword("");
    setErrorOtp("");
    setLoading(false);
    setResendLoading(false);
    setIsRegistering(false);
    setForgotPasswordFlow(false);
    setResetStep(1);
    setResetVerified(false);
    setRegistrationSuccess(false);
    setOtpSent(false);
  };

  /* ================= PASSWORD LOGIN ================= */
  const handlePasswordLogin = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setErrorEmail(emailError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrorPassword(passwordError);
      return;
    }

    setLoading(true);
    setErrorEmail("");
    setErrorPassword("");

    try {
      const result = await authPasswordLogin(email, password);

      if (result?.user) {
        // Close modal
        handleClose();

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        } else if (redirectPath) {
          // If redirectPath is provided, navigate there
          router.push(redirectPath);
        } else {
          // Use the redirect logic to determine where to go
          // Wait a moment for auth state to fully update
          setTimeout(() => {
            const path = getPostLoginRedirect(result.status || null);
            router.push(path);
          }, 100);
        }
      }
    } catch (err: any) {
      if (
        err.message?.includes("not found") ||
        err.message?.includes("invalid")
      ) {
        setErrorPassword(
          "Invalid email or password. Don't have an account? Click 'Sign up'.",
        );
      } else {
        setErrorPassword(err.message || "Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTRATION ================= */
  const handleRegister = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setErrorEmail(emailError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrorPassword(passwordError);
      return;
    }

    if (!confirmPassword || confirmPassword.trim() === "") {
      setErrorConfirmPassword("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorConfirmPassword("Passwords do not match.");
      return;
    }

    setLoading(true);
    setErrorEmail("");
    setErrorPassword("");
    setErrorConfirmPassword("");
    setOtpSent(false);

    try {
      const result = await authRegister(email, password, confirmPassword);
      if (result?.user) {
        setStep(2);
        setOtpSent(true);
        otpRefs[0].current?.focus();
      }
    } catch (err: any) {
      if (
        err.message?.includes("already exists") ||
        err.message?.includes("taken")
      ) {
        setErrorEmail("Email already registered. Please login instead.");
      } else {
        setErrorEmail(err.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP VERIFICATION ================= */
  const handleVerifyOtp = async (otpValue?: string) => {
    const code = otpValue || otp.join("");
    if (code.length !== 4) {
      setErrorOtp("Please enter the 4-digit code.");
      return;
    }

    setLoading(true);
    setErrorOtp("");

    try {
      if (forgotPasswordFlow && resetStep === 2) {
        // Verify reset OTP - use forgotPasswordEmail
        const emailToVerify = forgotPasswordEmail || email;
        const result = await authVerifyResetOtp(emailToVerify, code);
        if (result.success) {
          setResetVerified(true);
          setResetStep(3); // Move to new password step
        }
      } else {
        // Verify registration OTP - use registration email
        const result = await authVerifyOtp(email, code, "registration");
        if (result && (result as any).verified === true) {
          // Registration OTP verified successfully
          setRegistrationSuccess(true);
          setStep(3); // Move to registration success step
        }
      }
    } catch (err: any) {
      setErrorOtp(err.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORGOT PASSWORD FLOW ================= */
  const handleForgotPassword = async () => {
    const emailToUse = forgotPasswordEmail;

    const emailError = validateEmail(emailToUse);
    if (emailError) {
      setErrorEmail(emailError);
      return;
    }

    setLoading(true);
    setErrorEmail("");
    setOtpSent(false);

    try {
      const result = await authForgotPassword(emailToUse);
      if (result.success) {
        if (!forgotPasswordFlow) {
          setForgotPasswordFlow(true);
        }
        setResetStep(2); // Move to OTP step
        setOtpSent(true);
        otpRefs[0].current?.focus();
      }
    } catch (err: any) {
      setErrorEmail(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET PASSWORD ================= */
  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setErrorConfirmNewPassword("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorNewPassword("Password must be at least 6 characters");
      return;
    }

    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      setErrorNewPassword("OTP is required (4 digits)");
      return;
    }

    setLoading(true);
    setErrorNewPassword("");
    setErrorConfirmNewPassword("");

    try {
      const emailToReset = forgotPasswordEmail || email;

      const result = await authResetPassword(
        emailToReset,
        otpCode,
        newPassword,
        confirmNewPassword,
      );

      if (result.success) {
        setResetStep(4); // Success step
      } else {
        throw new Error(result.message || "Failed to reset password");
      }
    } catch (err: any) {
      if (err.message.includes("Passwords do not match")) {
        setErrorConfirmNewPassword(err.message);
      } else if (
        err.message.includes("Invalid") ||
        err.message.includes("expired") ||
        err.message.includes("OTP")
      ) {
        setErrorNewPassword("OTP error: " + err.message);
      } else {
        setErrorNewPassword(
          err.message || "Failed to reset password. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setErrorOtp("");
    setOtp(["", "", "", ""]);

    try {
      if (forgotPasswordFlow) {
        await authForgotPassword(forgotPasswordEmail);
      } else {
        await authSendOtp(
          email,
          isRegistering ? "registration" : "reset_password",
        );
      }
      // Show success message with spam notice
      alert("OTP resent! Please check your inbox or spam folder.");
    } catch {
      setErrorOtp("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  /* ================= REGISTRATION SUCCESS HANDLER ================= */
  const handleRegistrationSuccess = () => {
    // Reset to login step instead of closing
    setStep(1);
    setIsRegistering(false);
    setRegistrationSuccess(false);
    setEmail(email); // Keep the email pre-filled
    setPassword("");
    setConfirmPassword("");
    setOtp(["", "", "", ""]);
    setOtpSent(false);

    // Focus on password input after a short delay
    setTimeout(() => {
      const passwordInput = document.getElementById(
        "password",
      ) as HTMLInputElement;
      if (passwordInput) passwordInput.focus();
    }, 100);
  };

  /* ================= RESET ON CLOSE ================= */
  useEffect(() => {
    if (!isLoginOpen) {
      handleClose();
    }
  }, [isLoginOpen]);

  /* ================= TRUNCATE EMAIL ================= */
  const truncateEmail = (email: string) => {
    if (!email) return "";
    return email.length > 20
      ? `${email.slice(0, 5)}...@${email.split("@")[1]}`
      : email;
  };

  /* ================= FOCUS OTP INPUTS ================= */
  useEffect(() => {
    if (step === 2 || resetStep === 2) {
      setTimeout(() => {
        otpRefs[0].current?.focus();
      }, 100);
    }
  }, [step, resetStep]);

  /* ================= RENDER FUNCTIONS ================= */

  /* ---------- REGISTRATION SUCCESS STEP ---------- */
  const renderRegistrationSuccess = () => (
    <div className="login mb-20 w-full text-center">
      <div className="text-green-600 mb-6">
        <CheckCircle size={64} className="mx-auto mb-4" />
        <h2 className="text-2xl font-semibold">Email Verified Successfully!</h2>
      </div>

      <p className="text-gray-600 mb-4">
        Your email has been verified and your account has been created.
      </p>

      <p className="text-gray-600 mb-8 font-medium">
        Please login with your email and password to continue.
      </p>

      <button
        onClick={handleRegistrationSuccess}
        className="w-full bg-main text-white text-[17px] p-3 rounded-md hover:bg-main/95 hover:cursor-pointer transition"
      >
        Go to Login
      </button>
    </div>
  );

  /* ---------- FORGOT PASSWORD: EMAIL INPUT ONLY ---------- */
  const renderForgotPasswordEmail = () => (
    <div className="login mb-20 w-full">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-semibold">Reset your password</h1>
        <p className="text-gray-600 mt-2">
          Enter your email address and we'll send you an OTP to reset your
          password.
        </p>
      </div>

      <form className="flex flex-col gap-4 w-full">
        <FloatingInput
          id="forgotPasswordEmail"
          label="Email address"
          type="email"
          value={forgotPasswordEmail}
          onChange={(e) => {
            const v = e.target.value;
            setForgotPasswordEmail(v);
            const error = validateEmail(v);
            setErrorEmail(error);
          }}
          className={errorEmail ? "border-red-500 focus:ring-red-500" : ""}
          autoFocus
        />
        {errorEmail && <div className="text-red-500 text-sm">{errorEmail}</div>}
      </form>

      <button
        onClick={handleForgotPassword}
        disabled={loading || !forgotPasswordEmail.trim()}
        className={`w-full bg-main text-white text-[17px] p-3 rounded-md hover:bg-main/95 hover:ring-1 ring-main/95 hover:cursor-pointer transition mt-6 ${
          loading || !forgotPasswordEmail.trim()
            ? "opacity-60 pointer-events-none"
            : ""
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
            Sending OTP...
          </span>
        ) : (
          "Send OTP"
        )}
      </button>

      <div className="text-center mt-4">
        <button
          type="button"
          className="text-sm text-blue-500 hover:text-blue-700 hover:underline font-semibold"
          onClick={() => {
            setForgotPasswordFlow(false);
            setForgotPasswordEmail("");
            setErrorEmail("");
          }}
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );

  /* ---------- LOGIN/REGISTER (DEFAULT VIEW) ---------- */
  const renderLoginRegister = () => (
    <div className="login mb-20 w-full">
      <h1 className="text-2xl font-semibold">
        {isRegistering ? "" : "Welcome to SomoHub!"}
      </h1>

      <form className="flex flex-col gap-4 w-full">
        <FloatingInput
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => {
            const v = e.target.value;
            setEmail(v);
            const error = validateEmail(v);
            setErrorEmail(error);
          }}
          className={errorEmail ? "border-red-500 focus:ring-red-500" : ""}
        />
        {errorEmail && <div className="text-red-500 text-sm">{errorEmail}</div>}

        <div className="relative">
          <FloatingInput
            id="password"
            label={isRegistering ? "Create Password" : "Password"}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              const v = e.target.value;
              setPassword(v);
              const error = validatePassword(v);
              setErrorPassword(error);
              if (isRegistering && confirmPassword && v === confirmPassword) {
                setErrorConfirmPassword("");
              }
            }}
            className={errorPassword ? "border-red-500 focus:ring-red-500" : ""}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errorPassword && (
          <div className="text-red-500 text-sm">{errorPassword}</div>
        )}

        {isRegistering && (
          <div className="relative">
            <FloatingInput
              id="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                const v = e.target.value;
                setConfirmPassword(v);
                if (!v.trim()) {
                  setErrorConfirmPassword("Please confirm your password.");
                } else if (v !== password) {
                  setErrorConfirmPassword("Passwords do not match.");
                } else {
                  setErrorConfirmPassword("");
                }
              }}
              className={
                errorConfirmPassword ? "border-red-500 focus:ring-red-500" : ""
              }
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errorConfirmPassword && (
              <div className="text-red-500 text-sm">{errorConfirmPassword}</div>
            )}
          </div>
        )}

        {!isRegistering && (
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-blue-500 hover:text-blue-700 hover:underline"
              onClick={() => {
                setForgotPasswordFlow(true);
                if (email.trim()) {
                  setForgotPasswordEmail(email);
                }
              }}
            >
              Forgot password?
            </button>
          </div>
        )}
      </form>

      <button
        onClick={isRegistering ? handleRegister : handlePasswordLogin}
        disabled={
          loading ||
          !email.trim() ||
          !password.trim() ||
          (isRegistering && !confirmPassword.trim())
        }
        className={`w-full bg-main text-white text-[17px] p-3 rounded-md hover:bg-main/95 hover:ring-1 ring-main/95 hover:cursor-pointer transition mt-3 ${
          loading ||
          !email.trim() ||
          !password.trim() ||
          (isRegistering && !confirmPassword.trim())
            ? "opacity-60 pointer-events-none"
            : ""
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
            {isRegistering ? "Creating Account..." : "Logging in..."}
          </span>
        ) : isRegistering ? (
          "Create Account"
        ) : (
          "Login"
        )}
      </button>

      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
        </span>
        <button
          type="button"
          className="text-sm text-blue-500 hover:text-blue-700 hover:underline font-semibold"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setErrorEmail("");
            setErrorPassword("");
            setErrorConfirmPassword("");
            setPassword("");
            setConfirmPassword("");
          }}
        >
          {isRegistering ? "Login instead" : "Sign up"}
        </button>
      </div>

      <Divider text="or" className="w-full" />

      <button
        className="bg-white font-semibold text-[17px] p-3 rounded-md hover:bg-zinc-100 hover:cursor-pointer transition flex justify-center items-center gap-2 border border-gray-400 w-full"
        onClick={() => console.log("Google login clicked")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 48 48"
        >
          <path
            fill="#fbc02d"
            d="M43.611 20.083H42V20H24v8h11.303c-1.59 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20c11.045 0 20-8.955 20-20 0-1.341-.138-2.65-.389-3.917z"
          />
          <path
            fill="#e53935"
            d="M6.306 14.691l6.571 4.819C14.655 16.108 19.6 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.843 0-14.455 4.522-17.694 10.691z"
          />
          <path
            fill="#4caf50"
            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.842 26.727 37 24 37c-4.202 0-7.772-2.596-9.096-6.355l-6.522 5.025C11.202 39.556 17.227 44 24 44z"
          />
          <path
            fill="#1565c0"
            d="M43.611 20.083H42V20H24v8h11.303c-1.086 3.18-3.086 5.887-5.803 7.612l.001-.001 6.19 5.238C39.332 36.842 44 30.954 44 24c0-1.341-.138-2.65-.389-3.917z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>
    </div>
  );

  /* ---------- OTP STEP ---------- */
  const renderOtpStep = () => {
    const emailToShow = forgotPasswordFlow ? forgotPasswordEmail : email;

    return (
      <div className="login mb-20">
        <h1 className="text-2xl font-semibold mb-4">
          {forgotPasswordFlow ? "Reset Password" : "Verify your email"}
        </h1>

        <div className="text-md w-full text-center mb-2">
          Enter the code sent to {truncateEmail(emailToShow)}
        </div>

        {/* Spam folder notice - show when OTP is sent */}
        {otpSent && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm">
            <p className="text-yellow-800 flex items-start gap-2">
              <Mail className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Didn't receive the email?</strong> Please check your
                spam folder and mark as "Not Spam" to ensure future emails reach
                your inbox.
              </span>
            </p>
          </div>
        )}

        <div className="flex gap-2 justify-center items-center mb-4">
          {[0, 1, 2, 3].map((index) => (
            <Input
              key={index}
              ref={otpRefs[index]}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={otp[index]}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                const newOtp = [...otp];
                newOtp[index] = value;
                setOtp(newOtp);
                if (value.length === 1 && index < 3) {
                  otpRefs[index + 1].current?.focus();
                }
                if (newOtp.join("").length === 4) {
                  handleVerifyOtp(newOtp.join(""));
                }
              }}
              onKeyDown={(e) => {
                if (
                  e.key === "Backspace" &&
                  otp[index].length === 0 &&
                  index > 0
                ) {
                  otpRefs[index - 1].current?.focus();
                }
              }}
              className="w-12 h-12 text-center border-2 border-zinc-300 text-xl"
            />
          ))}
        </div>

        {errorOtp && (
          <div className="w-full flex justify-start items-center gap-1 mb-4">
            <CircleAlertIcon className="text-error-text w-5 h-5" />
            <p className="text-start text-sm text-error-text font-semibold">
              {errorOtp}
            </p>
          </div>
        )}

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="text-sm text-blue-500 hover:text-blue-700 hover:underline disabled:opacity-50"
          >
            {resendLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Resending...
              </span>
            ) : (
              "Didn't receive a code? Resend"
            )}
          </button>
        </div>
      </div>
    );
  };

  /* ---------- NEW PASSWORD STEP ---------- */
  const renderNewPasswordStep = () => (
    <div className="login mb-20 w-full">
      <h1 className="text-2xl font-semibold mb-6">Create New Password</h1>

      {resetVerified && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Email verified successfully</span>
          </div>
        </div>
      )}

      <form className="flex flex-col gap-4 w-full">
        <div className="relative">
          <FloatingInput
            id="newPassword"
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => {
              const v = e.target.value;
              setNewPassword(v);
              const error = validatePassword(v);
              setErrorNewPassword(error);
              if (confirmNewPassword && v === confirmNewPassword) {
                setErrorConfirmNewPassword("");
              }
            }}
            className={
              errorNewPassword ? "border-red-500 focus:ring-red-500" : ""
            }
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errorNewPassword && (
          <div className="text-red-500 text-sm">{errorNewPassword}</div>
        )}

        <div className="relative">
          <FloatingInput
            id="confirmNewPassword"
            label="Confirm New Password"
            type={showConfirmNewPassword ? "text" : "password"}
            value={confirmNewPassword}
            onChange={(e) => {
              const v = e.target.value;
              setConfirmNewPassword(v);
              if (!v.trim()) {
                setErrorConfirmNewPassword("Please confirm your new password.");
              } else if (v !== newPassword) {
                setErrorConfirmNewPassword("Passwords do not match.");
              } else {
                setErrorConfirmNewPassword("");
              }
            }}
            className={
              errorConfirmNewPassword ? "border-red-500 focus:ring-red-500" : ""
            }
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
          >
            {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errorConfirmNewPassword && (
          <div className="text-red-500 text-sm">{errorConfirmNewPassword}</div>
        )}
      </form>

      <button
        onClick={handleResetPassword}
        disabled={loading || !newPassword.trim() || !confirmNewPassword.trim()}
        className={`w-full bg-main text-white text-[17px] p-3 rounded-md hover:bg-main/95 hover:ring-1 ring-main/95 hover:cursor-pointer transition mt-3 ${
          loading || !newPassword.trim() || !confirmNewPassword.trim()
            ? "opacity-60 pointer-events-none"
            : ""
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
            Resetting Password...
          </span>
        ) : (
          "Reset Password"
        )}
      </button>
    </div>
  );

  /* ---------- RESET PASSWORD SUCCESS STEP ---------- */
  const renderSuccessStep = () => (
    <div className="login mb-20 w-full text-center">
      <div className="text-green-600 mb-6">
        <CheckCircle size={64} className="mx-auto mb-4" />
        <h2 className="text-2xl font-semibold">Password Reset Successful!</h2>
      </div>

      <p className="text-gray-600 mb-8">
        Your password has been reset successfully. You can now login with your
        new password.
      </p>

      <button
        onClick={() => {
          setStep(1);
          setForgotPasswordFlow(false);
          setResetStep(1);
          setResetVerified(false);
          setEmail(forgotPasswordEmail || email);
          setPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
          setForgotPasswordEmail("");
          setErrorEmail("");
          setErrorPassword("");
          setErrorNewPassword("");
          setErrorConfirmNewPassword("");
          setIsRegistering(false);
        }}
        className="w-full bg-main text-white text-[17px] p-3 rounded-md hover:bg-main/95 hover:cursor-pointer transition"
      >
        Go to Login
      </button>
    </div>
  );

  /* ================= DETERMINE CONTENT ================= */
  const renderContent = () => {
    if (forgotPasswordFlow) {
      switch (resetStep) {
        case 1: // Email input only for forgot password
          return renderForgotPasswordEmail();
        case 2: // OTP input
          return renderOtpStep();
        case 3: // New password
          return renderNewPasswordStep();
        case 4: // Success
          return renderSuccessStep();
        default:
          return renderForgotPasswordEmail();
      }
    } else {
      switch (step) {
        case 1: // Login/Register
          return renderLoginRegister();
        case 2: // OTP
          return renderOtpStep();
        case 3: // Registration Success
          return renderRegistrationSuccess();
        default:
          return renderLoginRegister();
      }
    }
  };

  /* ================= GET DIALOG TITLE ================= */
  const getDialogTitle = () => {
    if (forgotPasswordFlow) {
      switch (resetStep) {
        case 1:
          return "Reset Password";
        case 2:
          return "Verify OTP";
        case 3:
          return "Create New Password";
        case 4:
          return "Success!";
        default:
          return "Reset Password";
      }
    } else {
      switch (step) {
        case 1:
          return isRegistering ? "Create Account" : "Login";
        case 2:
          return "Verify Email";
        case 3:
          return "Email Verified";
        default:
          return "Login or sign up";
      }
    }
  };

  /* ================= HANDLE BACK BUTTON ================= */
  const handleBack = () => {
    if (forgotPasswordFlow) {
      if (resetStep === 2) {
        setResetStep(1);
      } else if (resetStep === 3) {
        setResetStep(2);
        setOtp(["", "", "", ""]);
      } else if (resetStep === 1) {
        setForgotPasswordFlow(false);
        setForgotPasswordEmail("");
      }
    } else if (step === 2) {
      setStep(1);
      setOtp(["", "", "", ""]);
    } else if (step === 3) {
      setStep(2);
      setRegistrationSuccess(false);
    }
  };

  const showBackButton =
    (forgotPasswordFlow && resetStep > 1) ||
    (!forgotPasswordFlow && (step === 2 || step === 3));

  return (
    <Dialog
      open={isLoginOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent
        className="p-0 w-full h-screen overflow-x-auto max-w-none md:w-lg md:max-w-lg md:max-h-[90vh] lg:max-h-[90vh] md:h-auto lg:h-auto rounded-none md:rounded-2xl flex flex-col justify-start items-center [&>button]:hidden" // This hides the default close button
      >
        <DialogHeader className="w-full">
          <DialogTitle
            className={`w-full flex ${
              showBackButton ? "justify-between" : "justify-center"
            } items-center border-b-2 p-4 sm:p-6 relative`}
          >
            {showBackButton && (
              <div
                className="flex items-center gap-2 cursor-pointer p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={handleBack}
              >
                <ArrowLeft className="w-5 h-5" />
              </div>
            )}

            <span className={showBackButton ? "" : "mx-auto"}>
              {getDialogTitle()}
            </span>

            {/* Close button at top right */}
            <button
              onClick={() => setIsLoginOpen(false)}
              className="flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </DialogTitle>
        </DialogHeader>

        {renderContent()}

        <DialogFooter
          className={`p-6 w-full flex justify-center items-center ${
            step !== 1 || (forgotPasswordFlow && resetStep > 1)
              ? "border-t-2"
              : ""
          }`}
        >
          {/* Close button at bottom right */}
          <div className="w-full flex justify-end">
            <button
              onClick={() => setIsLoginOpen(false)}
              className="flex items-center justify-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
