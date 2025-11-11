import { useState, useRef, useEffect, useCallback } from "react";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(10);
  const [running, setRunning] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const timerRef = useRef(null);

  // Helper to get total seconds
  const getTotalSeconds = useCallback(() => {
    return hours * 3600 + minutes * 60 + seconds;
  }, [hours, minutes, seconds]);

  // Memoized beep sound
  const beep = useCallback(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    oscillator.connect(ctx.destination);
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      ctx.close();
    }, 200);
  }, []);

  // Timer effect
  useEffect(() => {
    const totalSeconds = getTotalSeconds();
    if (!running || totalSeconds < 1) {
      setCountdown(totalSeconds);
      return;
    }
    beep();
    setCountdown(totalSeconds);
    timerRef.current = setInterval(() => {
      beep();
      setCountdown(totalSeconds);
    }, totalSeconds * 1000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : totalSeconds));
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(countdownInterval);
      timerRef.current = null;
    };
  }, [running, getTotalSeconds, beep]);

  const handleStart = () => setRunning(true);
  const handleStop = () => setRunning(false);

  const handleHoursChange = (e) => {
    const value = Math.max(0, Number(e.target.value));
    setHours(value);
  };
  const handleMinutesChange = (e) => {
    let value = Math.max(0, Number(e.target.value));
    if (value > 59) value = 59;
    setMinutes(value);
  };
  const handleSecondsChange = (e) => {
    let value = Math.max(0, Number(e.target.value));
    if (value > 59) value = 59;
    setSeconds(value);
  };

  useEffect(() => {
    setCountdown(getTotalSeconds());
  }, [hours, minutes, seconds, getTotalSeconds]);

  // Format countdown as hh:mm:ss
  const formatCountdown = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            margin: 0,
            backgroundColor: darkTheme.palette.background.default,
          },
          "*:focus": { outline: "none" },
        }}
      />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="xs" sx={{ textAlign: "center" }}>
          <HourglassTopIcon
            sx={{ fontSize: 64, mb: 2 }}
            aria-label="Hourglass Timer"
          />
          <Typography variant="h4" gutterBottom>
            Repeat Timer
          </Typography>
          <Box
            sx={{ mb: 2, display: "flex", gap: 1, justifyContent: "center" }}
          >
            <TextField
              label="Hours"
              type="number"
              value={hours}
              onChange={handleHoursChange}
              inputProps={{ min: 0, max: 99 }}
              disabled={running}
              sx={{ width: "80px" }}
            />
            <TextField
              label="Minutes"
              type="number"
              value={minutes}
              onChange={handleMinutesChange}
              inputProps={{ min: 0, max: 59 }}
              disabled={running}
              sx={{ width: "80px" }}
            />
            <TextField
              label="Seconds"
              type="number"
              value={seconds}
              onChange={handleSecondsChange}
              inputProps={{ min: 0, max: 59 }}
              disabled={running}
              sx={{ width: "80px" }}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" color="primary">
              {running ? `Next beep in ${formatCountdown(countdown)}` : ""}
            </Typography>
          </Box>
          <Box>
            {!running ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleStart}
                fullWidth
                disabled={getTotalSeconds() < 1}
              >
                Start
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="error"
                onClick={handleStop}
                fullWidth
              >
                Stop
              </Button>
            )}
          </Box>
          <Typography variant="body2" sx={{ mt: 4, color: "grey.500" }}>
            Plays a beep every interval.
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
