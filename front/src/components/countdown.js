import styles from './countdown.scss';
// import { Button } from 'antd';
import classNames from 'classnames';
import React, { Component } from 'react';

class Countdown extends Component {
  state = {
    num: this.props.num || 0
  }

  componentDidMount() {
    this.beginInterval()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
	    num: this.props.num
     });
    this.endInterval()
    this.beginInterval()
  }

  beginInterval = () => {
    this.timer = setInterval(this.doLoop, 1000)
  }

  endInterval = () => {
    clearInterval(this.timer)
  }

  componentWillUnmount() {
  	this.endInterval()
  }

  doLoop = () => {
    const num = this.state.num - 1
    
    if (num >= 0) {
      this.setState({
        num
      })
    } else {
      this.props.onEnd()
      this.endInterval()
    }
  }

  render() {
    const num = (this.state.num < 10) ? ('0' + this.state.num) : this.state.num
    const text = this.props.text.replace('%', num)
    return (
				<div className={styles.countdown}>{text}</div>
    );
  }
}

export default Countdown;
