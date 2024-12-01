import * as React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import checkAgainstCodes from '../utils/checkAgainstCodes';
import EachInput from './EachInput';

export default function NewGame() {
    const navigate = useNavigate();
    const [currentRound, setCurrentRound] = React.useState(0)
    const [difficulty, setDifficulty] = React.useState(null)
    const [stillGoing, setStillGoing] = React.useState(true)
    const [secretCode, setSecretCode] = React.useState("")
    //check curr_round should <10
    //after each guess:1. check against secret code: correct -> end game, redirect, delete storage, send date to backend
    //                                               wrong   -> if still can going, feedback, if can't going, redirect, delete storage, send date to backend

    React.useEffect(() => {
        const storedDifficulty = localStorage.getItem('difficulty');
        const storedSecretCode = localStorage.getItem("secret_code")
        if (storedDifficulty && storedSecretCode) {
            setDifficulty(storedDifficulty);
            setSecretCode(storedSecretCode);
            console.log("here is secret code", secretCode);
        }
    }, []);

    function handleSubmit(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const currentGuess = Array.from(formData.values())
        console.log("current guess", currentGuess)


        //get currentGuess from EachInput component as array
        if (currentGuess.length === difficulty) {

            setCurrentRound((prev) => prev + 1)
            const { correctNumber, correctLocation } = checkAgainstCodes(currentGuess, secretCode)
            console.log("correct number is", correctNumber, "correct Location", correctLocation)
            checkWinningCondition(correctLocation)
            return ({ correctLocation, correctNumber })
        }
    }

    function checkWinningCondition(correctLocation) {
        if (correctLocation === difficulty) {
            setStillGoing(false)
            setCurrentRound(-1)
            localStorage.removeItem('secret_code');
            localStorage.removeItem('difficulty');
            navigate('/game');
        }
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