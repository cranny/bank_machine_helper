import styles from './step.scss';
// import { Button } from 'antd';
import classNames from 'classnames';
import React, { Component } from 'react';

class Step extends Component {
  state = {
    num: this.props.num || 0
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div className={styles.crumbs}>
        <ul>
        <li>
          <a href="#1">阅读协议</a>
        </li>
        <li>
          <a href="#2">身份核查</a>
        </li>
        <li>
          <a href="#3">录入信息</a>
        </li>
        {/* <li>
          <a href="#3">发卡</a>
        </li> */}
        <li>
          <a href="#3">设置密码</a>
        </li>
        <li>
          <a href="#3">领取卡片</a>
        </li>
      </ul>
    </div>
    );
  }
}

export default Step;
