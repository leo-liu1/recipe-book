import React, { useRef, useState } from 'react';
import { useAuth } from "../components/handlers/AuthHandler";
import { Link } from "react-router-dom";

import { ReactComponent as FridgeIcon } from '../assets/icons/fridge.svg';

export default function Login() {
  document.title = "Login";

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const emailRef = useRef()
  const pswdRef = useRef()
  const { login, isUserAuthenticated } = useAuth()

  async function submitHandler(e) {
    e.preventDefault();

    const auth = await isUserAuthenticated();

    if (auth) {
      return setError("You are already logged in");
    }

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, pswdRef.current.value);
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
              <label>Email</label>
              <input type="email" ref={emailRef} placeholder="chef@recipetocook.com" required />
            </div>
            <div className="input">
              <label>Password</label>
              <input type="password" ref={pswdRef} placeholder="********" required />
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
