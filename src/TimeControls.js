import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TimeControls = (props) => {
  return (
    <div className="wrapper">
      <h2 className="title" id={`${props.Id}-label`}>
        {props.title}
      </h2>
      <div className="timerControl">
        <div className="buttons">
          <button
            className="btn-level"
            value="-"
            id={`${props.Id}-decrement`}
            onClick={props.handleChange}
          >
            <FontAwesomeIcon icon="arrow-down" size="2x" />
          </button>
          <h2 id={`${props.Id}-length`}>{props.timer / 60}</h2>
          <button
            className="btn-level"
            value="+"
            id={`${props.Id}-increment`}
            onClick={props.handleChange}
          >
            <FontAwesomeIcon icon="arrow-up" size="2x" />
          </button>
        </div>
        <h3 className="label">Time Controls</h3>
      </div>
    </div>
  );
};

export default TimeControls;
