import React, { useRef, useState, useContext } from 'react';
import { AuthContext } from '../components/handlers/AuthHandler';
import { Link } from 'react-router-dom';

import { ReactComponent as FridgeIcon } from '../assets/icons/fridge.svg';

/**
 * @callback checkAuth
 */

/**
 * Signup page for user authentication
 * @param {Object} signup
 * @param {checkAuth} signup.checkAuth - Callback that rechecks user authentication
 */
export default function Signup({ checkAuth }) {
  document.title = "Signup";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const pswdRef = useRef();
  const pswdConfirmRef = useRef();
  const { signup } = useContext(AuthContext);

  /**
   * Handler for when the form is submitted
   * @param {onSubmit} event - Event that triggers when the form is submitted 
   */
  async function submitHandler(event){
    event.preventDefault();
    if (pswdRef.current.value !== pswdConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    if ((emailRef.current.value === "") || (pswdRef.current.value === "")) {
      return setError("Email and Password cannot be empty");
    }

    if (pswdRef.current.value.length < 6) {
      return setError("Password must be at least 6 characters long");
    }

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, pswdRef.current.value);
      checkAuth();
    } catch {
      setError("Failed to create an account");
    }
    setLoading(false);
  }

  return (
    <div className="signup-container">
      <div className="form-box">
        <Link to="/" className="logo">
          <FridgeIcon className="logo-image"/>
          <div className="logo-text">Recipe to Cook</div>
        </Link>
        <div className="form-content">
          <div className="form-title">Create an account</div>
          <form onSubmit={submitHandler}>
          <div className="input">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" ref={emailRef} placeholder="chef@recipetocook.com" required />
          </div>
          <div className="input">
              <label htmlFor="password">Create a password</label>
              <input type="password" id="password" ref={pswdRef} placeholder="********" required />
          </div>
          <div className="input">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input type="password" id="confirmPassword" ref={pswdConfirmRef} placeholder="********" required />
          </div>
          <div className="error">{error}</div>
          <button disabled={loading} type="submit" className="action">
              Sign Up
          </button>
          </form>
        </div>
        <div className="alternative">
          <div className="text">Already signed up?</div>
          <Link to="/login" className="link">Log In</Link>
        </div>
      </div>
    </div>
  );
}
