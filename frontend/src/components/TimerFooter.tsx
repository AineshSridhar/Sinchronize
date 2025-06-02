import React, { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import socket from "../socket";

interface TimerFooterProps {
  roomId: string;
  userId: string;
}

const TimerFooter: React.FC<TimerFooterProps> = ({ roomId, userId }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const timeAddedRef = useRef(false); // to prevent adding elapsed time multiple times

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit("joinRoom", { roomId, userId });

    return () => {
      socket.emit("leaveRoom", { roomId, userId });
      socket.disconnect();
    };
  }, [roomId, userId]);

  useEffect(() => {
    const handleResumeTimer = ({ start }: { start: string }) => {
      const startTime = new Date(start);
      startTimeRef.current = startTime;
      setIsRunning(true);

      // Add elapsed seconds only once
      if (!timeAddedRef.current) {
        const elapsedSeconds = Math.floor((Date.now() - startTime.getTime()) / 1000);
        setTime((prev) => prev + elapsedSeconds);
        timeAddedRef.current = true;
      }
    };

    socket.on("resumeTimer", handleResumeTimer);
    return () => {
      socket.off("resumeTimer", handleResumeTimer);
      timeAddedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    // Fetch initial time on mount or when userId/roomId changes
    const fetchTime = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/rooms/activity/today/${userId}/${roomId}`
        );
        if (!res.ok) throw new Error("Failed to fetch time");
        const data = await res.json();
        setTime(data.time);
      } catch (err) {
        console.error("Failed to fetch time:", err);
      }
    };
    fetchTime();
  }, [roomId, userId]);

  const handleToggle = () => {
    if (isRunning) {
      socket.emit("stopTimer", {
        roomId,
        userId,
        start: startTimeRef.current?.toISOString(),
        end: new Date().toISOString(),
      });
      startTimeRef.current = null;
      timeAddedRef.current = false;
    } else {
      const start = new Date().toISOString();
      startTimeRef.current = new Date(start);
      socket.emit("startTimer", { roomId, userId, start });
    }
    setIsRunning((prev) => !prev);
  };

  const formatTime = (s: number) => {
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 bg-purple-900 border-t flex justify-center gap-4 items-center text-white">
      <button
        onClick={handleToggle}
        className="text-white p-2 border border-white border-2 rounded-full mt-2"
      >
        {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
      <div className="text-3xl">{formatTime(time)}</div>
      <hr className="my-4" />
    </div>
  );
};

export default TimerFooter;
