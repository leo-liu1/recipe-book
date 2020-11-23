import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../components/handlers/AuthHandler';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const pswdRef = useRef();
  const pswdConfirmRef = useRef();
  const { signup } = useAuth();

  async function submitHandler(e){
    e.preventDefault();
    if (pswdRef.current.value !== pswdConfirmRef.current.value) {
      return setError("Confirm password is not matching your password.");
    }

    if((emailRef.current.value == "") || (pswdRef.current.value == "")){
      return setError("Email and Password can't be empty.");
    }

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, pswdRef.current.value);
    } catch {
      setError("Fail to create an account!");
    }
    setLoading(false);
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={submitHandler}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={pswdRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={pswdConfirmRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-3">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </>
  )
}
