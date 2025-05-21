import React, { useEffect, useState } from 'react'

const TimerFooter = () => {
    const [running, setRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const socket = useSocket();

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if(running) {
            interval = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [running]);

    const startTimer = () => {
        setRunning(true);
        socket.emit('startTimer', {roomId});
    };

    const pauseTimer = () => {
        setRunning(false);
        socket.emit('pauseTimer', {roomId, seconds});
    }

  return (
    <div>
        <div>Study Timer: {Math.floor(seconds/60)} : {seconds % 60}</div>
        <button onClick={running ? pauseTimer : startTimer}>
            {running ? 'Pause' : 'Start'}
        </button>
    </div>
  )
}

export default TimerFooter
