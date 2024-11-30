import React from 'react';
import GameRule from './GameRule';


//a form to collect game setting:1. difficulty level 2. number range
//send form data to backend /newgame
export default function Game() {
    const [username, setUsername] = React.useState("");

    React.useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        setUsername(storedUsername);
    }, []);

    return (
        <div>
            <h1>Welcome to the Game, {username}!</h1>
            <GameRule />

        </div>
    )
}