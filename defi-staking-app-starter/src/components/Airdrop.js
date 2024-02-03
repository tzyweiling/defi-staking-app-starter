import React, { Component } from "react";

class Airdrop extends Component {
  //Airdrop: have a timer that counts down
  //initialize the countdown after customers ha ve staked a certain amount
  //timer functionality, countdown, startTimer, state - for time to work

  constructor() {
    super();
    //time is an object
    //second: countdown to be display
    this.state = {
      time: {},
      seconds: 20,
    };

    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  startTimer() {
    if (this.timer == 0 && this.state.seconds > 0) {
      //2 arguments: what (num) u want to be set as interval, the interval (the speed we want to be counting down)
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    //1.countdown 1 sec at a time
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    //2.stop counting when we hit 0
    if (seconds == 0) {
      clearInterval(this.timer);
    }
  }

  secondsToTime(secs) {
    let hours, minutes, seconds;
    hours = Math.floor(secs / (60 * 60));

    let devisor_for_minutes = secs % (60 * 60);
    minutes = Math.floor(devisor_for_minutes / 60);
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    let devisor_for_seconds = devisor_for_minutes % 60;
    seconds = Math.ceil(devisor_for_seconds);
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    let obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };
    return obj;
  }

  //being called immediately after components is mounted
  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }

  airdropReleaseTokens() {
    let stakingB = this.props.stakingBalance;
    if (stakingB >= "50000000000000000000") {
      this.startTimer();
    }
  }

  render() {
    this.airdropReleaseTokens();
    return (
      <div style={{ color: "black" }}>
        {this.state.time.m}:{this.state.time.s}
      </div>
    );
  }
}

export default Airdrop;
