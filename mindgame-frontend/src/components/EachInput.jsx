
import * as React from 'react';
import '../App.css';
import Result from './Result'
export default function EachInput({ index, difficulty, currentRound, handleSubmit }) {


    const [correctNumber, setCorrectNumber] = React.useState(0);
    const [correctLocation, setCorrectLocation] = React.useState(0);
    //if current round is not equal to index, disable the input
    const isDisabled = currentRound !== index;
    const showResult = currentRound > index


    function handleGuess(e) {
        e.preventDefault();
        console.log("here are inputs", e.target.value, typeof (e.target.value))
        const result = handleSubmit(e);

        if (result) {
            setCorrectNumber(result.correctNumber);
            setCorrectLocation(result.correctLocation);
        }


    }
    return (
        <div className='form'>
            <form onSubmit={handleGuess}>
                <label>{index + 1}. </label>
                {Array.from({ length: difficulty }, (_, i) => <input key={i} type="number" className="inputField" min={0} max={9} name={i} required disabled={isDisabled} />)
                }
                <button type="submit" disabled={isDisabled} className='submit-btn'>Submit</button>
                <div> {showResult ?
                    <Result correctLocation={correctLocation} correctNumber={correctNumber} />
                    : null}</div>

            </form >
        </div >
    )
}