import{ useState, useEffect } from 'react';

const useTimer = () => {
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (startTime) {
      interval = setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsedMs = currentTime - startTime;
        const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
        const elapsedMinutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
        const elapsedSeconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);
        setElapsedTime(`${padZero(elapsedHours)}:${padZero(elapsedMinutes)}:${padZero(elapsedSeconds)}`);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [startTime]);

  const startTimer = () => {
    setStartTime(new Date().getTime());
  };

  const resetTimer = () => {
    setStartTime(0);
    setElapsedTime('00:00:00');
  };

  const padZero = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  return {elapsedTime, resetTimer, startTimer, startTime};
};

export default useTimer;