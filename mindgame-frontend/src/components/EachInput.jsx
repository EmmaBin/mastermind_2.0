
import * as React from 'react';
import '../App.css';
export default function EachInput({ difficulty, handleSubmit, stillGoing }) {

    const isDisabled = stillGoing



    function handleGuess(e) {
        e.preventDefault();

        handleSubmit(e);




    }
    return (
        <div className='form'>
            <form onSubmit={handleGuess}>
                <label>Input your guess:</label>
                {Array.from({ length: difficulty }, (_, i) => <input key={i} type="number" className="inputField" min={0} max={9} name={i} required disabled={isDisabled} />)
                }
                <button type="submit" disabled={isDisabled} className='submit-btn'>Submit</button>


            </form >
        </div >
    )
}

