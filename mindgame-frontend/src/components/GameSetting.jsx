import React from 'react';
import { useNavigate } from 'react-router-dom';

//a form to collect game setting:1. difficulty level 2. number range
//send form data to backend /newgame

export default function GameSetting() {

    const [difficulty, setDifficulty] = React.useState("4")
    const [startNum, setStartNum] = React.useState("0")
    const [endNum, setEndNum] = React.useState("9")

    const navigate = useNavigate();

    async function startGame(e) {
        console.log("startGame function triggered");
        e.preventDefault();

        const gameSetting = {
            difficulty: difficulty,
            startNum: startNum,
            endNum: endNum
        }
        try {
            const response = await fetch("/new_game", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(gameSetting)

            })

            const data = await response.json()
            if (response.ok) {
                localStorage.setItem("secret_code", data.secretCode);
                localStorage.setItem('difficulty', difficulty);
                console.log(data.gameId)
                navigate(`/game/${data.gameId}`)
            } else {
                alert(data.message)
            }




        } catch (error) {
            console.log(error)
            alert("Failed to start the game. Please try again.")
        }


    }

    return (
        <div>
            <form onSubmit={startGame}>
                <label htmlFor='level'> Pick your Difficulty Level:</label>
                <div id="level" className="level-btns">
                    <button
                        type="button"
                        className={difficulty === "4" ? "selected" : ""}
                        onClick={() => setDifficulty("4")}
                    >
                        Easy
                    </button>
                    <button
                        type="button"
                        className={difficulty === "5" ? "selected" : ""}
                        onClick={() => setDifficulty("5")}
                    >
                        Medium
                    </button>
                    <button
                        type="button"
                        className={difficulty === "6" ? "selected" : ""}
                        onClick={() => setDifficulty("6")}
                    >
                        Hard
                    </button>
                </div>

                <label htmlFor="startNum"> Number Starts: </label>
                <select
                    className="startNum"
                    id="startNum"
                    value={startNum}
                    onChange={(e) => setStartNum(e.target.value)}>
                    {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={i}>{i}</option>
                    ))}


                </select>

                <label htmlFor="endNum">Number Ends:</label>
                <select
                    className="endNum"
                    id="endNum"
                    value={endNum}
                    onChange={(e) => setEndNum(e.target.value)}
                >
                    {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={i}>
                            {i}
                        </option>
                    ))}
                </select>
                <button type="submit">Start Game</button>


            </form>
        </div>
    )

}
