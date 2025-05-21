import React, { useEffect, useRef, useState } from 'react'
import {io} from 'socket.io-client';

const socket = io('http://localhost:5000');

const TimerFooter = ({roomId, userId} : {roomId: string; userId: string}) => {
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        socket.emit('joinRoom', roomId)
        socket.on('timerUpdate', (data) => {
            setIsRunning(data.isRunning);
            setTime(data.time);
        });
        return () => {
            socket.disconnect();
        };
    }, [roomId]);

    useEffect(() => {
        if(isRunning){
            intervalRef.current = setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
     }, [isRunning])

    const handleToggle = () => {
        const newRunningState = !isRunning;
        setIsRunning(newRunningState);
        socket.emit('toggleTimer', {roomId, isRunning: newRunningState, time});
    };

    const formatTime = (s: number) => {
        const minutes = Math.floor(s/60);
        const seconds = s % 60;
        return `${minutes}m ${seconds}s`;
    }
  return (
    <div>
      <div>Study Time: {formatTime(time)}</div>
      <button onClick={handleToggle}>{isRunning ? 'Pause' : 'Start' }</button>
    </div>
  )
}

export default TimerFooter
