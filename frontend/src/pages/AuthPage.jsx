import React, { useState } from "react";
import {
  User,
  Building2,
  ShieldCheck,
  Globe,
  Hash,
  Shield,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const AuthPage = ({ isSignUpInitial = false }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(isSignUpInitial);
  const [role, setRole] = useState("customer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    agencyName: "",
    panNumber: "",
    adminName: "",
    accessKey: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on input
  };

  const validateForm = () => {
    const { email, password } = formData;

    if (!email || !password) {
      setError("Please fill in all required fields");
      return false;
    }

    if (isSignUp) {
      if (role === "customer" && !formData.fullName) {
        setError("Full name is required");
        return false;
      }
      if (role === "agency") {
        if (!formData.agencyName || !formData.panNumber) {
          setError("Agency name and PAN number are required");
          return false;
        }
        if (!/^\d{9}$/.test(formData.panNumber)) {
          setError("PAN number must be 9 digits");
          return false;
        }
      }
      if (role === "admin") {
        if (!formData.adminName || !formData.accessKey) {
          setError("Admin name and access key are required");
          return false;
        }
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isSignUp) {
        await handleRegister();
      } else {
        await handleLogin();
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Critical: sends/receives cookies
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Store user info in context/state management (not token!)
    localStorage.setItem("user", JSON.stringify(data.user));

    // Redirect based on role
    redirectBasedOnRole(data.user.role);
  };

  const handleRegister = async () => {
    const payload = {
      email: formData.email,
      password: formData.password,
      role,
    };

    // Add role-specific fields
    if (role === "customer") {
      payload.name = formData.fullName;
    } else if (role === "agency") {
      payload.name = formData.agencyName;
      payload.panNumber = formData.panNumber;
    } else if (role === "admin") {
      payload.name = formData.adminName;
      payload.accessKey = formData.accessKey;
    }

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // Auto-login after registration or show success message
    setIsSignUp(false);
    setError("");
    // Optional: Auto-fill email after registration
  };

  const redirectBasedOnRole = (role) => {
    const routes = {
      customer: "/dashboard",
      agency: "/agency/dashboard",
      admin: "/admin/dashboard",
    };
    navigate(routes[role] || "/dashboard");
  };

  const toggleMode = (mode) => {
    setIsSignUp(mode);
    setError("");
    setFormData({
      email: "",
      password: "",
      fullName: "",
      agencyName: "",
      panNumber: "",
      adminName: "",
      accessKey: "",
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-form-side">
        <header className="auth-header">
          <div className="auth-logo">
            <Globe size={26} /> <span>NepalYatra</span>
          </div>
          <p className="auth-tagline">A Journey That Never Ends</p>
        </header>

        <div className="auth-tabs">
          <button
            className={`auth-tab-btn ${isSignUp ? "active" : ""}`}
            onClick={() => toggleMode(true)}
            disabled={isLoading}
          >
            Register
          </button>
          <button
            className={`auth-tab-btn ${!isSignUp ? "active" : ""}`}
            onClick={() => toggleMode(false)}
            disabled={isLoading}
          >
            Login
          </button>
        </div>

        <section className="form-section">
          <h2 className="form-title">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Role Selection Tabs - Only for Sign Up */}
            {isSignUp && (
              <div className="role-selector">
                <button
                  type="button"
                  className={`role-option ${role === "customer" ? "active" : ""}`}
                  onClick={() => setRole("customer")}
                >
                  <User size={16} /> <span>Traveler</span>
                </button>
                <button
                  type="button"
                  className={`role-option ${role === "agency" ? "active" : ""}`}
                  onClick={() => setRole("agency")}
                >
                  <Building2 size={16} /> <span>Agency</span>
                </button>
                <button
                  type="button"
                  className={`role-option ${role === "admin" ? "active" : ""}`}
                  onClick={() => setRole("admin")}
                >
                  <Shield size={16} /> <span>Admin</span>
                </button>
              </div>
            )}

            {/* Email Field */}
            <div className="input-group">
              <label className="input-label" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="auth-input"
                required
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            {/* Dynamic Fields Based on Role */}
            {isSignUp && (
              <div className="dynamic-fields">
                {role === "customer" && (
                  <div className="input-group">
                    <label className="input-label" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="auth-input"
                      required
                      autoComplete="name"
                      disabled={isLoading}
                    />
                  </div>
                )}

                {role === "agency" && (
                  <>
                    <div className="input-group">
                      <label className="input-label" htmlFor="agencyName">
                        Agency Legal Name
                      </label>
                      <input
                        type="text"
                        id="agencyName"
                        name="agencyName"
                        value={formData.agencyName}
                        onChange={handleInputChange}
                        className="auth-input"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label" htmlFor="panNumber">
                        Company PAN Number
                      </label>
                      <div className="input-with-icon">
                        <Hash size={16} className="field-icon" />
                        <input
                          type="text"
                          id="panNumber"
                          name="panNumber"
                          value={formData.panNumber}
                          onChange={handleInputChange}
                          placeholder="9-digit PAN Number"
                          className="auth-input icon-padding"
                          required
                          maxLength={9}
                          pattern="\d{9}"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </>
                )}

                {role === "admin" && (
                  <>
                    <div className="input-group">
                      <label className="input-label" htmlFor="adminName">
                        Administrator Full Name
                      </label>
                      <input
                        type="text"
                        id="adminName"
                        name="adminName"
                        value={formData.adminName}
                        onChange={handleInputChange}
                        placeholder="Admin Official Name"
                        className="auth-input"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label" htmlFor="accessKey">
                        System Access Key
                      </label>
                      <div className="input-with-icon">
                        <Shield size={16} className="field-icon" />
                        <input
                          type="password"
                          id="accessKey"
                          name="accessKey"
                          value={formData.accessKey}
                          onChange={handleInputChange}
                          placeholder="Enter secure key"
                          className="auth-input icon-padding"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Password Field */}
            <div className="input-group">
              <label className="input-label" htmlFor="password">
                Password
              </label>
              <div className="input-with-icon">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="auth-input icon-padding-right"
                  required
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  minLength={isSignUp ? 8 : undefined}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {isSignUp && (
                <small className="password-hint">Minimum 8 characters</small>
              )}
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="spinner" />
                  {isSignUp ? "Creating Account..." : "Logging In..."}
                </>
              ) : isSignUp ? (
                "Register Account"
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {/* Additional Links */}
          {!isSignUp && (
            <div className="auth-links">
              <a href="/forgot-password" className="auth-link">
                Forgot password?
              </a>
            </div>
          )}
        </section>
      </div>

      <div className="auth-hero-side">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">
              Experience <br />
              The Himalayas.
            </h1>
            <p className="hero-subtitle">
              The first integrated platform for verified tour operators and
              global travelers in Nepal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
