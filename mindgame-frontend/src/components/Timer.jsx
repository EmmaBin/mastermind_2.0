import * as React from 'react';
import '../App.css';

export default function Timer({ stopTimer }) {
    const [second, setSecond] = React.useState(() => {
        // retrieve the saved timer value 
        const savedTime = localStorage.getItem('elapsedTime')
        return savedTime ? parseInt(savedTime, 10) : 0
    });

    React.useEffect(() => {
        let timer;

        if (stopTimer) {
            clearInterval(timer)
            localStorage.removeItem('elapsedTime')
        } else {
            timer = setInterval(() => {
                setSecond((prev) => {
                    const newTime = prev + 1
                    localStorage.setItem('elapsedTime', newTime)
                    return newTime;
                })
            }, 1000)
        }


        return () => {
            clearInterval(timer)
        }
    }, [stopTimer])

    React.useEffect(() => {
        if (stopTimer) {

            localStorage.removeItem('elapsedTime')
        }
    }, [stopTimer])

    const minute = Math.trunc(second / 60)
    const remainingSeconds = second % 60

    return (
        <div className='timer'>
            {String(minute).padStart(2, '0')} : {String(remainingSeconds).padStart(2, '0')}
        </div>
    )
}
