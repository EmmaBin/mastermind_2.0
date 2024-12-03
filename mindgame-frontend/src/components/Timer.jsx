import React from 'react';

export default function Timer({ isGameActive, onGameEnd }) {
    const [seconds, setSeconds] = React.useState(() => {
        const savedTime = localStorage.getItem('elapsedTime');
        return savedTime ? parseInt(savedTime, 10) : 0;
    });

    React.useEffect(() => {
        let timer;

        if (isGameActive) {
            timer = setInterval(() => {
                setSeconds((prev) => {
                    const newTime = prev + 1;
                    localStorage.setItem('elapsedTime', newTime);
                    return newTime;
                });
            }, 1000);
        } else {
            clearInterval(timer);
            localStorage.removeItem('elapsedTime');
        }

        return () => clearInterval(timer);
    }, [isGameActive]);

    React.useEffect(() => {
        if (!isGameActive) {
            onGameEnd();
        }
    }, [isGameActive, onGameEnd]);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return (
        <div className="timer">
            {String(hours).padStart(2, '0')}:
            {String(minutes).padStart(2, '0')}:
            {String(remainingSeconds).padStart(2, '0')}
        </div>
    );
}
