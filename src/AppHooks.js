import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import TimeControls from "../src/TimeControls";
import "./AppHooks.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import {
  faPause,
  faPlay,
  faSync,
  faArrowDown,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";

const audio = document.getElementById("beep");

library.add(fas, faPlay, faPause, faSync, faArrowDown, faArrowUp);

// My version - functional components with Rect Hooks - pomodoro clock

function AppHooks() {
  const [sessionTimer, setSessionTimer] = useState(1500);
  const [breakTimer, setBreakTimer] = useState(300);
  const [output, setOutput] = useState("25:00");
  const [isRunning, setIsRunning] = useState(false);
  const [currentTimer, setCurrentTimer] = useState({
    mode: "Session",
    count: 1500,
  });
  const storeRef = useRef(null);

  // Dynamically updating the props for both time interval components
  const sessionProps = {
    title: "Session Length",
    Id: "session",
    timer: sessionTimer,
    mode: "Session",
    handleChange: (e) => handleTimeChange(e, "Session"),
  };

  const breakProps = {
    title: "Break Length",
    Id: "break",
    timer: breakTimer,
    mode: "Break",
    handleChange: (e) => handleTimeChange(e, "Break"),
  };

  // Displaying the current time (counter) in string format
  useEffect(() => {
    const count = currentTimer.count;
    let minutes = Math.floor(count / 60);
    let seconds = count % 60;
    if (seconds < 10) {
      seconds = seconds.toString() ? "0" + seconds : seconds;
    }
    if (minutes < 10) {
      minutes = minutes.toString() ? "0" + minutes : minutes;
    }
    setOutput(`${minutes}:${seconds}`);
  }, [currentTimer.count]);

  // Switching between the time modes when counter equals 0
  const tick = useCallback(() => {
    if (currentTimer.count !== 0) {
      setCurrentTimer({
        mode: currentTimer.mode,
        count: currentTimer.count - 1,
      });
      return;
    }

    if (currentTimer.mode === sessionProps.mode) {
      setCurrentTimer({ mode: breakProps.mode, count: breakTimer });
    } else if (currentTimer.mode === breakProps.mode) {
      setCurrentTimer({ mode: sessionProps.mode, count: sessionTimer });
    }
    audio.play();
  }, [
    currentTimer,
    breakTimer,
    sessionTimer,
    breakProps.mode,
    sessionProps.mode,
  ]);

  // Counter - you can update it only if not running
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    if (storeRef?.current) {
      clearInterval(storeRef.current);
    }
    const counter = setInterval(tick, 1000);
    storeRef.current = counter;
  }, [isRunning, tick]);

  // Updating the current time counter from time controls
  const updateOutput = (mode, count) => {
    if (currentTimer.mode !== mode) {
      return;
    }
    setCurrentTimer({ mode: mode, count: count });
  };

  // Updating time intervals with time controls
  const handleTimeChange = (e, mode) => {
    if (isRunning === true) {
      return;
    }

    const buttonId = e.target.id;
    let tmpCount;
    if (mode === "Break") {
      tmpCount = breakTimer;
      if (buttonId.includes("increment") && breakTimer < 3600) {
        tmpCount = breakTimer + 60;
      } else if (buttonId.includes("decrement") && breakTimer > 0) {
        tmpCount = breakTimer - 60;
      }
      setBreakTimer(tmpCount);
    } else {
      tmpCount = sessionTimer;
      if (buttonId.includes("increment") && sessionTimer < 3600) {
        tmpCount = sessionTimer + 60;
      } else if (buttonId.includes("decrement") && sessionTimer > 0) {
        tmpCount = sessionTimer - 60;
      }
      setSessionTimer(tmpCount);
    }
    updateOutput(mode, tmpCount);
  };

  // Reset both timers and the counter to default values
  const handleReset = () => {
    clearInterval(storeRef.current);
    setSessionTimer(1500);
    setBreakTimer(300);
    setOutput("25:00");
    setIsRunning(false);
    setCurrentTimer({
      mode: "Session",
      count: 1500,
    });
    audio.pause();
    audio.currentTime = 0;
  };

  // Start/Stop the real time counter
  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
      clearInterval(storeRef.current);
      return;
    }
    setIsRunning(true);
  };

  return (
    <div className="app">
      <div className="main-title">25 + 5 Clock</div>
      <div className="controls">
        <TimeControls {...sessionProps} />
        <TimeControls {...breakProps} />
      </div>
      <div className="timer">
        <div className="timer-wrapper">
          <div id="timer-label">{currentTimer.mode}</div>
          <div id="time-left">{output}</div>
        </div>
      </div>
      <div className="timer-control">
        <button id="start_stop" onClick={handleStartStop}>
          <FontAwesomeIcon icon={`${isRunning ? "pause" : "play"}`} size="2x" />
        </button>
        <button id="reset" onClick={handleReset}>
          <FontAwesomeIcon icon="sync" size="2x" />
        </button>
      </div>
      <div className="author">Coded by Dimitar Odrinski</div>
    </div>
  );
}

export default AppHooks;
