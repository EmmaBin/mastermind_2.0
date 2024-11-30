import React from 'react';

//a form to collect game setting:1. difficulty level 2. number range
//send form data to backend /newgame

export default function GameSetting() {

    const [difficulty, setDifficulty] = React.useState("")
    const [startNum, setStartNum] = React.useState("0")
    const [endNum, setEndNum] = React.useState("9")

    async function startGame(e) {
        console.log("startGame function triggered");
        e.preventDefault();
        console.log("Difficulty:", difficulty);
        console.log("Start Number:", startNum);
        console.log("End Number:", endNum);

        const gameSetting = {
            difficulty: difficulty,
            startNum: startNum,
            endNum: endNum
        }
        try {
            const response = await fetch("http://127.0.0.1:5000/new_game", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(gameSetting)

            })

            const data = await response.json()
            console.log(data.message)


        } catch (error) {
            console.log(error)
            alert("Failed to start the game. Please try again.")
        }


    }

    return (
        <div>
            <form onSubmit={startGame}>
                <label htmlFor='level'> Pick your Difficulty Level:</label>
                <div id="level" className='level-btns'>
                    <button type="button" onClick={() => setDifficulty("4")}>Easy</button>
                    <button type="button" onClick={() => setDifficulty("5")}>Medium</button>
                    <button type="button" onClick={() => setDifficulty("6")}>Hard</button>
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
