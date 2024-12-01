import * as React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import checkAgainstCodes from '../utils/checkAgainstCodes';
import EachInput from './EachInput';
import { useParams } from 'react-router-dom';

export default function NewGame() {
    const navigate = useNavigate();
    const [currentRound, setCurrentRound] = React.useState(0)
    const [difficulty, setDifficulty] = React.useState(null)
    const [stillGoing, setStillGoing] = React.useState(true)
    const [secretCode, setSecretCode] = React.useState("")
    const { gameId } = useParams();
    //after each guess:1. check against secret code: correct -> end game, redirect, delete storage, send date to backend
    //                                               wrong   -> if still can going, feedback, if can't going, redirect, delete storage, send date to backend

    React.useEffect(() => {
        const storedDifficulty = localStorage.getItem('difficulty');
        const storedSecretCode = localStorage.getItem("secret_code")

        if (storedDifficulty && storedSecretCode) {
            setDifficulty(Number(storedDifficulty));
            setSecretCode(storedSecretCode);
            console.log("here is secret code", secretCode);
        }
    }, [secretCode, difficulty]);

    function handleSubmit(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const currentGuess = Array.from(formData.values())

        if (currentGuess.length === difficulty) {
            setCurrentRound((prev) => prev + 1)
            const { correctNumber, correctLocation } = checkAgainstCodes(currentGuess, secretCode)
            checkWinningCondition(correctLocation)
            return ({ correctLocation, correctNumber })
        }
    }

    async function checkWinningCondition(correctLocation) {
        if (correctLocation === difficulty) {
            const gameSituation = {
                win: true,
                guess: currentRound + 1
            }
            console.log("Payload being sent to backend - win:", gameSituation);

            try {
                const response = await fetch(`/game/${gameId}/win`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(gameSituation)
                });

                if (response.ok) {
                    const data = await response.json()
                    console.log("Response from backend (win):", data)
                    alert("Yay! You won the game!")
                    endGame()
                    setTimeout(() => navigate('/game'), 5000)
                } else {
                    console.error("Error from backend (win):", response.status);
                    alert("Failed to update game state on the server. Please try again.");
                }
            } catch (error) {
                console.error("Network error (win):", error);
                alert("Network error occurred. Please check your connection and try again.");
            }

        } else if (currentRound + 1 >= 10) {
            const gameSituation = {
                win: false,
                guess: currentRound + 1,
            };
            console.log("Payload being sent to backend (lose):", gameSituation);

            try {
                const response = await fetch(`/game/${gameId}/lose`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(gameSituation),
                });

                if (response.ok) {
                    const data = await response.json()
                    console.log("Response from backend (lose):", data);
                    alert("Game Over! You've reached the maximum number of guesses.")
                    endGame()
                    setTimeout(() => navigate('/game'), 5000);
                } else {
                    console.error("Error from backend (lose):", response.status, response.statusText)
                    alert("Failed to update game state on the server. Please try again.")
                }
            } catch (error) {
                console.error("Network error (lose):", error);
                alert("Network error occurred. Please check your connection and try again.")
            }
        }

    }

    function endGame() {
        setStillGoing(false)
        setCurrentRound(-1)
        localStorage.removeItem('secret_code');
        localStorage.removeItem('difficulty');
    }

    return (
        <div>
            <button onClick={() => navigate("/game")}>Go back to game setting to restart game</button>
            {
                Array.from({ length: 10 }, (_, index) => <EachInput
                    key={index}
                    difficulty={difficulty}
                    currentRound={currentRound}
                    handleSubmit={handleSubmit}
                    index={index}
                    stillGoing={stillGoing} />)
            }


        </div>
    );
}



