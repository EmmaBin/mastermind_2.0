import * as React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div>
            <h1>Welcome to the Mastermind Game!</h1>
            <p>Please use the link to login.</p>
            <Link to="/login">
                <button>Login to my account</button>
            </Link>
        </div>
    )
}