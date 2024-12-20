import * as React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    const [hallOfFame, setHallOfFame] = React.useState([]);
    const [selection, setSelection] = React.useState("mostWins")

    React.useEffect(() => {
        // fetch data based on selection - GET
        fetch(`/halloffame?criteria=${selection}`)
            .then(response => response.json())
            .then(data => {
                setHallOfFame(data)
                console.log(data)
            })
            .catch(error => console.error('Error fetching Hall of Fame:', error));
    }, [selection])


    return (
        <div className='App'>
            <div className='home-title'>
                <h1>Welcome to the Mastermind Game!</h1>
                <p>Please use the link to login.</p>
                <div className="home-btn">
                    <Link to="/login">
                        <button>Login to my account</button>
                    </Link>
                </div>
                <div className="home-btn">
                    <Link to="/register">
                        <button>New user?</button>
                    </Link>
                </div>
            </div>


            <h2>Hall of Fame</h2>
            <div className='home-hall-of-fame'>
                <label htmlFor="selection">Select criteria to display:</label>
                <select value={selection} id="selection" onChange={(e) => setSelection(e.target.value)}>
                    <option value="mostWins">Top wins</option>
                    <option value="leastTime">Least time spent</option>
                    <option value="leastGuess">Least Guesses</option>
                </select>
                <div className='home-table'>
                    {hallOfFame.length > 0 ? (
                        <table border="1" style={{ borderCollapse: "collapse", width: "50%", marginTop: "20px" }} className="hall-of-fame-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Wins</th>
                                    <th>Time Spent</th>
                                    <th>Guesses</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hallOfFame.map((entry, i) => (
                                    <tr key={i}>
                                        <td>{entry.username}</td>
                                        <td>{entry.wins}</td>
                                        <td>{entry.time_spent}</td>
                                        <td>{entry.guesses}</td>
                                    </tr>

                                ))}
                            </tbody>

                        </table>
                    ) : (
                        <p>No data available at this time. Start playing the game to be the first name to appear here!</p>
                    )}

                </div>


            </div>

        </div>
    )
}