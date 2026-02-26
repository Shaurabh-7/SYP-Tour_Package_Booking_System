import React, { useState } from 'react';
import { User, Building2, ShieldCheck, Globe, Hash, Shield } from 'lucide-react';
import './AuthPage.css';

const AuthPage = ({ isSignUpInitial }) => {
  const [isSignUp, setIsSignUp] = useState(isSignUpInitial);
  const [role, setRole] = useState('customer');

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
            className={`auth-tab-btn ${isSignUp ? 'active' : ''}`}
            onClick={() => setIsSignUp(true)}
          >Register</button>
          <button 
            className={`auth-tab-btn ${!isSignUp ? 'active' : ''}`}
            onClick={() => setIsSignUp(false)}
          >Login</button>
        </div>

        <section className="form-section">
          <h2 className="form-title">{isSignUp ? "Create your account" : "Welcome back"}</h2>
          
          <form onSubmit={(e) => e.preventDefault()}>
            {/* Role Selection Tabs */}
            {isSignUp && (
              <div className="role-selector">
                <div 
                  className={`role-option ${role === 'customer' ? 'active' : ''}`}
                  onClick={() => setRole('customer')}
                ><User size={16}/> <span>Traveler</span></div>
                <div 
                  className={`role-option ${role === 'agency' ? 'active' : ''}`}
                  onClick={() => setRole('agency')}
                ><Building2 size={16}/> <span>Agency</span></div>
                <div 
                  className={`role-option ${role === 'admin' ? 'active' : ''}`}
                  onClick={() => setRole('admin')}
                ><Shield size={16}/> <span>Admin</span></div>
              </div>
            )}

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input type="email" placeholder="" className="auth-input" required />
            </div>

            {/* DYNAMIC FIELDS BASED ON ROLE */}
            {isSignUp && (
              <div className="dynamic-fields">
                {role === 'customer' && (
                  <div className="input-group">
                    <label className="input-label">Full Name</label>
                    <input type="text" placeholder="" className="auth-input" required />
                  </div>
                )}

                {role === 'agency' && (
                  <>
                    <div className="input-group">
                      <label className="input-label">Agency Legal Name</label>
                      <input type="text" placeholder="" className="auth-input" required />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Company PAN Number</label>
                      <div className="input-with-icon">
                        <Hash size={16} className="field-icon" />
                        <input type="text" placeholder="9-digit PAN Number" className="auth-input icon-padding" required />
                      </div>
                    </div>
                  </>
                )}

                {role === 'admin' && (
                  <>
                    <div className="input-group">
                      <label className="input-label">Administrator Full Name</label>
                      <input type="text" placeholder="Admin Official Name" className="auth-input" required />
                    </div>
                    <div className="input-group">
                      <label className="input-label">System Access Key</label>
                      <div className="input-with-icon">
                        <Shield size={16} className="field-icon" />
                        <input type="password" placeholder="Enter secure key" className="auth-input icon-padding" required />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="input-group">
              <label className="input-label">Password</label>
              <input type="password" placeholder="" className="auth-input" required />
            </div>

            <button type="submit" className="auth-submit-btn">
              {isSignUp ? "Register Account" : "Log In"}
            </button>
          </form>
        </section>
      </div>

      <div className="auth-hero-side">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Experience <br/>The Himalayas.</h1>
            <p className="hero-subtitle">The first integrated platform for verified tour operators and global travelers in Nepal.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;