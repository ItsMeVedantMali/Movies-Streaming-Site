import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import "./Signup.css"
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const Signup = () => {
    const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
    const [message, setMessage] = useState("");
    const [variant, setVariant] = useState("info");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
            setVariant("danger");
            return setMessage("Please fill in all fields.");
        }
        if (!emailRegex.test(form.email)) {
            setVariant("danger");
            return setMessage("Invalid email format.");
        }

        if (!passwordRegex.test(form.password)) {
            setVariant("danger");
            return setMessage("Password must be at least 8 characters long, contain uppercase and lowercase letters, a number, and a special character.");
        }

        if (form.password !== form.confirmPassword) {
            setVariant("danger");
            return setMessage("Passwords do not match");
        }


        const response = await fetch("http://localhost:5000/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });
        const data = await response.json();
        setVariant(data.success ? "success" : "danger");
        setMessage(data.message);

        if (data.success) {
            setTimeout(() => navigate("/login"), 2000);
        }
    };

    return (
        <Container className='signup-container'>
            <Row className='justify-content-md-center mt-5'>
                <Col xs={12} sm={10} md={6} lg={5}>
                    <Card className="signup-card shadow-lg p-4">
                        <h3 className="text-center mb-4 text-primary">
                            Sign Up
                        </h3>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="fullName"
                                    placeholder="Enter your full name"
                                    value={form.fullName}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Re-enter your password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                Signup
                            </Button>

                        </Form>
                        {message && (
                            <Alert variant={variant} className="mt-3">
                                {message}
                            </Alert>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Signup;