import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const [loginForm, setLoginForm] = React.useState({
        userEmail: "",
        userPassword: ""
    });

    const navigate = useNavigate();

    function handleInput(e) {
        const { name, value } = e.target;
        setLoginForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        console.log('Login Form Submitted:', loginForm);
        const payload = {
            userEmail: loginForm.userEmail,
            userPassword: loginForm.userPassword
        }
        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem("username", data.username);
                console.log(data.username)
                navigate('/game');
            } else {
                alert(data.message)
            }


        } catch (error) {
            console.log(error)
            alert("Unable to Login. Please try again later.")
        }




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
