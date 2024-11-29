import React from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
    const [loginForm, setLoginForm] = React.useState({
        userEmail: "",
        userPassword: ""
    });

    function handleInput(e) {
        const { name, value } = e.target;
        setLoginForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log('Login Form Submitted:', loginForm);
        // API call to submit loginForm data to the backend
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="userEmail">Enter your email:</label>
            <input
                id="userEmail"
                type="email"
                name="userEmail"
                value={loginForm.userEmail}
                onChange={handleInput}
                required
            />

            <label htmlFor="userPassword">Enter your password:</label>
            <input
                id="userPassword"
                type="password"
                name="userPassword"
                value={loginForm.userPassword}
                onChange={handleInput}
                required
            />

            <button type="submit">Login</button>

            <p>
                New User? <Link to="/register">Register here</Link>
            </p>
        </form>
    );
}
