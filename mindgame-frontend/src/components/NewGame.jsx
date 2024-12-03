import * as React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import checkAgainstCodes from '../utils/checkAgainstCodes';
import EachInput from './EachInput';
import { useParams } from 'react-router-dom';
import Timer from './Timer';
import getHints from '../utils/gethints';

export default function NewGame() {
    const navigate = useNavigate();
    const [currentRound, setCurrentRound] = React.useState(0)
    const [difficulty, setDifficulty] = React.useState(null)
    const [stillGoing, setStillGoing] = React.useState(true)
    const [secretCode, setSecretCode] = React.useState("")
    const [stopTimer, setStopTimer] = React.useState(false)
    const [showHints, setShowHints] = React.useState(false)
    const [hintsResult, setHintsResult] = React.useState(null);
    const [gameHistory, setGameHistory] = React.useState([])
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

    }, []);

    React.useEffect(() => {
        const fetchGameHistory = async () => {
            try {
                const response = await fetch(`/game/${gameId}/guesses`, { method: 'GET' });
                if (response.ok) {
                    const data = await response.json();
                    console.log("Game history fetched:", data);
                    setGameHistory(data);
                } else {
                    console.error("Failed to fetch game history:", response.status);
                }
            } catch (error) {
                console.error("Network error while fetching game history:", error);
            }
        };

        fetchGameHistory();
    }, []); // Add gameId as a dependency



    async function saveGuessToDB(guess, correctNumber, correctLocation) {
        const payload = {
            guess: guess.join(""),
            correctNumbers: correctNumber,
            correctLocations: correctLocation,
        };

        try {
            const response = await fetch(`/game/${gameId}/guesses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.error("Error saving guess to server:", response.status);
            }
        } catch (error) {
            console.error("Network error while saving guess:", error);
        }
    }

    function handleSubmit(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const currentGuess = Array.from(formData.values())

        if (currentGuess.length === difficulty) {
            setCurrentRound((prev) => prev + 1)
            const { correctNumber, correctLocation } = checkAgainstCodes(currentGuess, secretCode)
            //send each uer guess to server, and read user's guess, correctNumber, correctLocation to display in the table
            const newGuess = {
                guess: currentGuess.join(""),
                correct_numbers: correctNumber,
                correct_locations: correctLocation,
            };
            setGameHistory((prev) => [
                ...prev,
                newGuess,
            ]);

            saveGuessToDB(currentGuess, correctNumber, correctLocation);
            checkWinningCondition(correctLocation)

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
        setStopTimer(true)
    }


    function displayHints() {
        setShowHints(prev => !prev)
        if (!showHints) {
            const secretCode = localStorage.getItem('secret_code').split("");
            const hints = getHints(secretCode);
            setHintsResult(hints);
        } else {
            setHintsResult(null);
        }


    }

    return (
        <div>
            <Timer />
            <br></br>
            <button onClick={() => navigate("/game")}>Go back to game setting to restart game</button>
            <button onClick={displayHints}>{showHints ? "Hide Hints" : "Hints"}</button>
            {showHints && hintsResult && (
                <div>
                    <p>1. Total: {hintsResult.total}</p>
                    <p>2. First Number: {hintsResult.firstNumAttri}</p>
                    <p>3. Last Number: {hintsResult.lastNumAttri}</p>
                </div>
            )}
            <EachInput
                difficulty={difficulty}
                handleSubmit={handleSubmit}
                stillGoing={stillGoing} />

            {gameHistory.length > 0 ? (
                <table border="1" style={{ borderCollapse: "collapse", width: "5%", marginTop: "20px" }}>
                    <thead>
                        <tr>
                            <th>Your guess</th>
                            <th>Correct Location</th>
                            <th>Correct Number</th>

                        </tr>
                    </thead>
                    <tbody>
                        {gameHistory.map((entry, i) => (
                            <tr key={i}>
                                <td>{entry.guess}</td>
                                <td>{entry.correct_locations}</td>
                                <td>{entry.correct_numbers}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            ) : (
                <p>Loading your game history!</p>
            )}



        </div>
    );
}



