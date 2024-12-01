import * as React from 'react';
import '../App.css';
export default function NewGame() {

    const [difficulty, setDifficulty] = React.useState(null);

    React.useEffect(() => {
        const storedDifficulty = localStorage.getItem('difficulty');
        if (storedDifficulty) {
            setDifficulty(storedDifficulty);
        }
    }, []);

    return (
        <div>
            <h1>New Game</h1>
            <p>Difficulty Level: {difficulty}</p>

        </div>
    );

}