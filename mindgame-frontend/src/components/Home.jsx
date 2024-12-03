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
        <div>
            <h1>Welcome to the Mastermind Game!</h1>
            <p>Please use the link to login.</p>
            <Link to="/login">
                <button>Login to my account</button>
            </Link>


            <h2>Hall of Fame</h2>
            <label htmlFor="selection">Select criteria to display:</label>
            <select value={selection} id="selection" onChange={(e) => setSelection(e.target.value)}>
                <option value="mostWins">Top wins</option>
                <option value="leastTime">Least time spent</option>
                <option value="leastGuess">Least Guesses</option>
            </select>
        </div>
    )
}