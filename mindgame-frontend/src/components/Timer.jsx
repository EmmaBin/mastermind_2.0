import * as React from 'react';
import '../App.css';
export default function Timer({ restart, stopTimer }) {

    const [second, setSecond] = React.useState(0)

    React.useEffect(() => {
        setSecond(0);
        let timer
        if (stopTimer) {
            console.log("stop timer", second)


        }
        if (!stopTimer) {
            timer = setInterval(() => {
                setSecond(prev => prev + 1)
            }, 1000)
        }

        return () => {
            clearInterval(timer);
        };
    }, [restart, stopTimer])

    const minute = Math.trunc(second / 60)
    const remainingSeconds = second % 60

    return (
        <>
            <div className='timer'>
                {String(minute).padStart(2, '0')} : {String(remainingSeconds).padStart(2, '0')}
            </div>
        </>

    )
}