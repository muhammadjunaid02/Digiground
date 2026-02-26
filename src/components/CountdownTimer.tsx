import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CountdownTimerProps {
  targetDate: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft('LIVE');
        setIsStarted(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      let timeString = '';
      if (days > 0) timeString += `${days}d `;
      timeString += `${hours.toString().padStart(2, '0')}h ${minutes
        .toString()
        .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
      
      setTimeLeft(timeString);
      setIsStarted(false);
    };

    calculateTime();
    intervalRef.current = setInterval(calculateTime, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [targetDate]);

  return (
    <View style={styles.container}>
      <Text style={[styles.timerText, isStarted && styles.startedText]}>
        {isStarted ? timeLeft : timeLeft}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 2,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#A0A0A0',
    letterSpacing: 0.1,
  },
  startedText: {
    color: '#38A169', // Match the green from the design if LIVE
    fontWeight: '800',
  },
});

export default CountdownTimer;
