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
    const [currentRound, setCurrentRound] = React.useState(null);
    const [difficulty, setDifficulty] = React.useState(null);
    const [stillGoing, setStillGoing] = React.useState(true);
    const [secretCode, setSecretCode] = React.useState("");
    const [stopTimer, setStopTimer] = React.useState(false);
    const [showHints, setShowHints] = React.useState(false);
    const [hintsResult, setHintsResult] = React.useState(null);
    const [gameHistory, setGameHistory] = React.useState([]);
    const { gameId } = useParams();

    React.useEffect(() => {
        const storedDifficulty = localStorage.getItem('difficulty');
        const storedSecretCode = localStorage.getItem("secret_code")
        const storedRound = localStorage.getItem("currentRound");

        if (storedDifficulty && storedSecretCode) {
            setDifficulty(Number(storedDifficulty));
            setSecretCode(storedSecretCode);
            console.log("here is secret code", secretCode);
        }

        if (storedRound !== null) {
            setCurrentRound(Number(storedRound)); // Use stored round value
        } else {
            setCurrentRound(0); // Default to 0 if no value is stored
        }

        const fetchGameHistory = async () => {
            try {
                const response = await fetch(`/game/${gameId}/guesses`, { method: 'GET' });
                if (response.ok) {
                    const data = await response.json();
                    setGameHistory(data);
                } else {
                    console.error("Failed to fetch game history:", response.status);
                }
            } catch (error) {
                console.error("Network error while fetching game history:", error);
            }
        };

        fetchGameHistory();
    }, [gameId]);

    React.useEffect(() => {
        if (currentRound !== null) {
            localStorage.setItem('currentRound', currentRound);
        }
    }, [currentRound]);

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
        e.preventDefault();
        const formData = new FormData(e.target);
        const currentGuess = Array.from(formData.values());

        if (currentGuess.length === difficulty) {
            const updatedRound = currentRound + 1;
            setCurrentRound(updatedRound);

            const { correctNumber, correctLocation } = checkAgainstCodes(currentGuess, secretCode);

            const newGuess = {
                guess: currentGuess.join(""),
                correct_numbers: correctNumber,
                correct_locations: correctLocation,
            };

            setGameHistory((prev) => [...prev, newGuess]);
            saveGuessToDB(currentGuess, correctNumber, correctLocation);
            checkWinningCondition(correctLocation, updatedRound);
        }
    }

    async function checkWinningCondition(correctLocation, updatedRound) {
        if (correctLocation === difficulty) {
            const gameSituation = {
                win: true,
                guess: updatedRound,
            };

            try {
                const response = await fetch(`/game/${gameId}/win`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(gameSituation),
                });

                if (response.ok) {
                    alert("Yay! You won the game!");
                    endGame();
                    setTimeout(() => navigate('/game'), 5000);
                } else {
                    alert("Failed to update game state on the server. Please try again.");
                }
            } catch (error) {
                alert("Network error occurred. Please check your connection and try again.");
            }
        } else if (updatedRound >= 10) {
            const gameSituation = {
                win: false,
                guess: updatedRound,
            };

            try {
                const response = await fetch(`/game/${gameId}/lose`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(gameSituation),
                });

                if (response.ok) {
                    alert("Game Over! You've reached the maximum number of guesses.");
                    endGame();
                    setTimeout(() => navigate('/game'), 5000);
                } else {
                    alert("Failed to update game state on the server. Please try again.");
                }
            } catch (error) {
                alert("Network error occurred. Please check your connection and try again.");
            }
        }
    }

    function endGame() {
        setStopTimer(true);
        setStillGoing(false);
        setCurrentRound(0);
        localStorage.removeItem('secret_code');
        localStorage.removeItem('difficulty');
        localStorage.removeItem('elapsedTime');
        localStorage.removeItem('currentRound');
    }

    function displayHints() {
        const shouldShowHints = !showHints;
        setShowHints(shouldShowHints);

        if (shouldShowHints) {
            const secretCode = localStorage.getItem('secret_code').split("");
            const hints = getHints(secretCode);
            setHintsResult(hints);
        } else {
            setHintsResult(null);
        }
    }

    return (
        <div>
            <Timer stopTimer={stopTimer} reset={currentRound === 0} />
            {currentRound !== null ? (
                <p>
                    Remaining {10 - currentRound}{" "}
                    {10 - currentRound === 1 ? "round" : "rounds"}
                </p>
            ) : (
                <p>Loading round data...</p>
            )}
            <br />
            <button onClick={() => navigate('/game')} className='new-game-btn'>
                Back to game setting to restart game
            </button>
            <br />
            <button className='new-game-btn' onClick={displayHints}>
                {showHints ? "Hide Hints" : "Hints"}
            </button>
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
                stillGoing={stillGoing}
            />
            <div className="game-history-container">
                {gameHistory.length > 0 ? (
                    <table className="game-history-table">
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
                    <p>Your game history will be displayed here!</p>
                )}
            </div>
        </div>
    );
}
