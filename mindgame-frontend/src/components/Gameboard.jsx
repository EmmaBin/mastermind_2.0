import React from 'react';
import GameRule from './GameRule';
import { useUser } from '../UserContext';

//a form to collect game setting:1. difficulty level 2. number range
//send form data to backend /newgame
export default function Game() {
    const { user } = useUser();
    return (
        <div>
            <h1>Welcome to the Game, {user}!</h1>
            <GameRule />

        </div>
    )
}