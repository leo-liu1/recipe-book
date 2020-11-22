import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../components/handlers/AuthHandler"

export default function Login() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const emailRef = useRef()
  const pswdRef = useRef()
  const { login } = useAuth()

  async function submitHandler(e) {
    e.preventDefault()
    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value, pswdRef.current.value)
    } catch {
      setError("Fail to log in!")
    }
    setLoading(false)
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
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
            <Button disabled={loading} className="w-100" type="submit">
              Log In
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-3">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </>
  )
}
