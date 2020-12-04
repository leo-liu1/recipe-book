import React, { useRef, useState, useContext } from 'react';
import { AuthContext } from "../components/handlers/AuthHandler";
import { Link } from "react-router-dom";

import { ReactComponent as FridgeIcon } from '../assets/icons/fridge.svg';

/**
 * @callback checkAuth
 */

/**
 * Login page for user authentication
 * @param {Object} login
 * @param {checkAuth} login.checkAuth - Callback that rechecks user authentication
 */
export default function Login({ checkAuth }) {
  document.title = "Login";

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRef = useRef();
  const pswdRef = useRef();
  const { login } = useContext(AuthContext);

  /**
   * Handler for when the form is submitted
   * @param {onSubmit} event - Event that triggers when the form is submitted 
   */
  async function submitHandler(event) {
    event.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, pswdRef.current.value);
      checkAuth();
    } catch {
      setError("Failed to log in");
    }
    setLoading(false);
  }

  return (
    <div className="login-container">
      <div className="form-box">
        <Link to="/" className="logo">
          <FridgeIcon className="logo-image"/>
          <div className="logo-text">Recipe to Cook</div>
        </Link>
        <div className="form-content">
          <div className="form-title">Log in</div>
          <form onSubmit={submitHandler}>
            <div className="input">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" ref={emailRef} placeholder="chef@recipetocook.com" required />
            </div>
            <div className="input">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" ref={pswdRef} placeholder="********" required />
            </div>
            <div className="error">{error}</div>
            <button disabled={loading} type="submit" className="action">
              Log In
            </button>
          </form>
        </div>
        <div className="alternative">
          <div className="text">Need an account?</div>
          <Link to="/signup" className="link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
