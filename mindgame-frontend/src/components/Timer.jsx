import * as React from 'react';
export default function Timer({ stopTimer, reset }) {
    const [second, setSecond] = React.useState(() => {
        if (reset) return 0;
        const savedTime = localStorage.getItem('elapsedTime');
        return savedTime ? parseInt(savedTime, 10) : 0;
    });

    React.useEffect(() => {
        if (reset) {
            setSecond(0);
            localStorage.setItem('elapsedTime', 0);
        }
    }, [reset]);

    React.useEffect(() => {
        let timer;

        if (stopTimer) {
            clearInterval(timer);
            localStorage.removeItem('elapsedTime');
        } else {
            timer = setInterval(() => {
                setSecond((prev) => {
                    const newTime = prev + 1;
                    localStorage.setItem('elapsedTime', newTime);
                    return newTime;
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [stopTimer]);

    const minute = Math.trunc(second / 60);
    const remainingSeconds = second % 60;

    return (
        <div className="timer">
            {String(minute).padStart(2, '0')} : {String(remainingSeconds).padStart(2, '0')}
        </div>
    );
}
