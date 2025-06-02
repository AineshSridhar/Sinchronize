import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  fetchStudentsStart,
  fetchStudentsFailure,
  fetchStudentsSuccess,
  updateStudentTime,
} from "../features/students/studentSlice";
import { RootState } from "../app/store";
import TimerFooter from "../components/TimerFooter";
import socket from "../socket";

interface Student {
  _id: string;
  userId: {
    id: string;
    name: string;
  };
  roomId: string;
  dailyStudy: Record<string, number>;
  currentSessionStart: string | null;
  timeStudiedHistory: any[];
  questionsSolved: number;
  lastActive: string;
  streak: number;
}

const RoomDetails: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const room = location.state?.room;
  const { students, loading, error } = useSelector(
    (state: RootState) => state.students
  ) as { students: Student[]; loading: boolean; error: string | null };
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  // Live timers
  const [activeTimers, setActiveTimers] = useState<Record<string, string>>({});
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!room || !userId) return;
    if (!socket.connected) socket.connect();
    socket.emit("joinRoom", { roomId: room._id, userId });
    return () => {
      socket.emit("leaveRoom", { roomId: room._id, userId });
      socket.disconnect();
    };
  }, [room, userId]);

  useEffect(() => {
    if (!room) return;
    dispatch(fetchStudentsStart());
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/rooms/${room._id}/students`,
          {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        dispatch(fetchStudentsSuccess(data));
      } catch (err) {
        dispatch(fetchStudentsFailure((err as Error).message));
      }
    })();
  }, [room, dispatch]);

  useEffect(() => {
    const handleTimeUpdate = (s: Student) =>
      dispatch(
        updateStudentTime({ userId: s.userId.id, timeStudied: getCumulativeMinutes(s) })
      );
    const handleTimerStart = ({ userId, startedAt }: any) =>
      setActiveTimers((p) => ({ ...p, [userId]: startedAt }));
    const handleTimerStop = ({ userId }: any) =>
      setActiveTimers((p) => { const c = { ...p }; delete c[userId]; return c; });

    socket.on("updateStudentTime", handleTimeUpdate);
    socket.on("userTimerStarted", handleTimerStart);
    socket.on("userTimerStopped", handleTimerStop);
    return () => {
      socket.off("updateStudentTime", handleTimeUpdate);
      socket.off("userTimerStarted", handleTimerStart);
      socket.off("userTimerStopped", handleTimerStop);
    };
  }, [dispatch]);

  const calculateElapsedSeconds = (startTime: string) =>
    Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);

  const getCumulativeMinutes = (student: Student) =>
    Object.values(student.dailyStudy || {}).reduce(
      (sum, v) => sum + (typeof v === 'number' ? v : 0),
      0
    );

  const getTotalSeconds = (s: Student) => {
    const cum = Math.round(getCumulativeMinutes(s) * 60);
    const live = activeTimers[s.userId.id]
      ? calculateElapsedSeconds(activeTimers[s.userId.id])
      : 0;
    return cum + live;
  };

  const formatHHMMSS = (t: number) => {
    if (isNaN(t) || t < 0) return '00:00:00';
    const h = Math.floor(t/3600);
    const m = Math.floor((t%3600)/60);
    const s = t%60;
    return `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Purple header strip */}
      <header className="w-full bg-purple-700 py-4 shadow-md">
        <h1 className="text-2xl text-white text-center font-semibold">
          {room ? room.name : 'Room Details'}
        </h1>
      </header>
      <main className="p-6">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((stu) => (
              <div key={stu._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                <h2 className="text-lg font-bold text-purple-800 mb-2">{stu.userId.name}</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Time: <span className="font-mono">{formatHHMMSS(getTotalSeconds(stu))}</span>
                </p>
                <p className="text-sm text-gray-600">Streak: {stu.streak}</p>
                {activeTimers[stu.userId.id] && (
                  <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Active
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <TimerFooter roomId={room?._id!} userId={userId!} />
    </div>
  );
};

export default RoomDetails;
