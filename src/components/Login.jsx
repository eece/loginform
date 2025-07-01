import React, { useState, useEffect } from 'react';
import {
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    FormFeedback,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const initialForm = {
    email: '',
    password: '',
    terms: false,
};

const errorMessages = {
    email: 'Please enter a valid email address',
    password: 'Password must be at least 4 characters long',
};

export default function Login() {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [isValid, setIsValid] = useState(false);

    const navigate = useNavigate();

    const handleChange = (event) => {
        let { name, value, type } = event.target;
        value = type === 'checkbox' ? event.target.checked : value;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!isValid || !form.terms) {
            return;
        }
        axios
            .get('https://6540a96145bedb25bfc247b4.mockapi.io/api/login')
            .then((res) => {
                const user = res.data.find(
                    (item) => item.password == form.password && item.email == form.email
                );
                if (user) {
                    setForm(initialForm);
                    navigate('/success');
                } else {
                    alert('Invalid email or password');
                }
            });
    };

    const emailIsValid = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    useEffect(() => {
        const newErrors = {
            email: form.email.length !== 0 && !emailIsValid(form.email) ? errorMessages.email : '',
            password: form.password.length !== 0 && form.password.length < 4 ? errorMessages.password : '',
        };

        setErrors(newErrors);
        setIsValid(newErrors.email === '' && newErrors.password === '');
    }, [form]);

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label for="exampleEmail">Email</Label>
                <Input
                    id="exampleEmail"
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                    onChange={handleChange}
                    value={form.email}
                    invalid={errors.email !== ''}
                />
                {errors.email && <FormFeedback data-testid="formfeedbackEmail">{errors.email}</FormFeedback>}
            </FormGroup>
            <FormGroup>
                <Label for="examplePassword">Password</Label>
                <Input
                    id="examplePassword"
                    name="password"
                    placeholder="Enter your password "
                    type="password"
                    onChange={handleChange}
                    value={form.password}
                    invalid={errors.password !== ''}
                />
                {errors.password && <FormFeedback data-testid="formfeedbackPassword">{errors.password}</FormFeedback>}
            </FormGroup>
            <FormGroup check>
                <Input
                    id="terms"
                    name="terms"
                    checked={form.terms}
                    type="checkbox"
                    onChange={handleChange}
                    data-testid="termsCheckbox"
                />{' '}
                <Label htmlFor="terms" check>
                    I agree to terms of service and privacy policy
                </Label>
            </FormGroup>
            <FormGroup className="text-center p-4">
                <Button color="primary" disabled={!isValid || !form.terms} data-testid="sign-in-button">
                    Sign In
                </Button>
            </FormGroup>
        </Form>
    );
}
