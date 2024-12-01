import React from 'react';
import GameRule from './GameRule';
import GameSetting from './GameSetting';



export default function GameBoard() {
    const [username, setUsername] = React.useState("");

    React.useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        setUsername(storedUsername);
    }, []);

    return (
        <div>
            <h1>Welcome to the Game, {username}!</h1>
            <GameRule />
            <GameSetting />


        </div>
    )
}