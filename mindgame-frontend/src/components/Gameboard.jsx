import React from 'react';
import GameRule from './GameRule';
import GameSetting from './GameSetting';
import { useNavigate } from 'react-router-dom';


export default function GameBoard() {
    const [username, setUsername] = React.useState("");
    const navigate = useNavigate();

    React.useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        setUsername(storedUsername);
    }, []);


    function Logout() {
        fetch('/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                navigate('/');
            })
            .catch(error => {
                console.error('Logout failed:', error);
            });

    }

    return (
        <div>
            <h1>Welcome to the Game, {username}!</h1>
            <button onClick={Logout}>Log out</button>

            <GameRule />
            <GameSetting />


        </div>
    )
}