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
  const [seconds, setSeconds] = useState(10);
  const [running, setRunning] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const timerRef = useRef(null);

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
    if (!running) {
      setCountdown(seconds);
      return;
    }
    beep();
    setCountdown(seconds);
    timerRef.current = setInterval(() => {
      beep();
      setCountdown(seconds);
    }, seconds * 1000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : seconds));
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(countdownInterval);
      timerRef.current = null;
    };
  }, [running, seconds, beep]);

  const handleStart = () => setRunning(true);
  const handleStop = () => setRunning(false);

  const handleSecondsChange = (e) => {
    const value = Math.max(1, Number(e.target.value));
    setSeconds(value);
    setCountdown(value);
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
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Seconds"
              type="number"
              value={seconds}
              onChange={handleSecondsChange}
              inputProps={{ min: 1 }}
              fullWidth
              disabled={running}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" color="primary">
              {running ? `Next beep in ${countdown}s` : ""}
            </Typography>
          </Box>
          <Box>
            {!running ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleStart}
                fullWidth
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
