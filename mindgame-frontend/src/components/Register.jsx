import * as React from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
    const [registerForm, setRegisterForm] = React.useState({
        userName: "",
        userEmail: "",
        userPassword: ""
    })

    function handleInput(e) {
        const { name, value } = e.target
        setRegisterForm(prevForm => ({
            ...prevForm,
            [name]: value
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const payloadData = {
            userName: registerForm.userName,
            userEmail: registerForm.userEmail,
            userPassword: registerForm.userPassword
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payloadData)
            })

            const data = await response.json()
            if (response.ok) {

                alert(data.message);
            } else {

                alert(data.error);
            }


        } catch (error) {
            console.error("Error:", error);
            alert("Unable to connect to the server. Please try again later.");

        }

    }
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="userName" >Enter your username:</label>
            <input
                id="userName"
                type="text"
                name="userName"
                value={registerForm.userName}
                onChange={handleInput}
                required
            />

            <label htmlFor="userEmail">Enter your email:</label>
            <input
                id="userEmail"
                type="email"
                name="userEmail"
                value={registerForm.userEmail}
                onChange={handleInput}
                required
            />

            <label htmlFor="userPassword">Enter your password:</label>
            <input
                id="userPassword"
                type="password"
                name="userPassword"
                value={registerForm.userPassword}
                onChange={handleInput}
                required
            />

            <button type="submit">Register</button>

            <p>
                Already Registered? <Link to="/login">Login here</Link>
            </p>
        </form>


    )

}