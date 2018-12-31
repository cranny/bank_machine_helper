import styles from './checkId.scss';
// import { Row, Col } from 'antd';
// import classNames from 'classnames';
import router from 'umi/router';
import { connect } from 'dva';
import { getBankAPI } from '../../lib/hardware';
import React from 'react';
import CountDown from '../../components/countdown'
import Step from '../../components/step'

const debug = require('debug')('wb:pages:checkId')

class Page extends React.Component {

  hasInserted = false

  componentDidMount() {
    getBankAPI().Ids.open()
    getBankAPI().Ids.insert()

    getBankAPI().Ids.once('onInserted', this.onInserted)
    getBankAPI().Ids.once('onRead', this.onRead)
    getBankAPI().Ids.once('onScan', this.onScan)
  }

  onTimeout = () => {
    getBankAPI().Ids.cancelInsert()
    getBankAPI().Ids.close()
    router.push('/');
  }

  componentWillUnmount() {
    getBankAPI().Ids.off('onInserted', this.onInserted)
    getBankAPI().Ids.off('onRead', this.onRead)
    getBankAPI().Ids.off('onScan', this.onScan)
    !this.hasInserted && getBankAPI().Ids.cancelInsert()
    this.hasInserted && getBankAPI().Ids.cancelInsert()
    getBankAPI().Ids.close()
  }

  onInserted = () => {
    this.hasInserted = true
    debug('接收到身份证已放置事件')
    getBankAPI().Ids.read()
    this.props.dispatch({
      type: 'app/showLoading',
      payload: {
        loading: '正在读取身份证信息',
      },
    });
  }

  onRead = payload =>{
    debug('接收到身份证已读取事件', payload)
    getBankAPI().Ids.scan()
    this.props.dispatch({
      type: 'ids/onRead',
      payload: payload.value
    });
    this.props.dispatch({
      type: 'app/showLoading',
      payload: {
        loading: '正在扫描身份证信息',
      }
    });
  }

  onScan = payload => {
    debug('接收到身份证已扫描事件', payload)
    this.props.dispatch({
      type: 'ids/onScan',
      payload: payload.value
    });

    this.props.dispatch({
      type: 'app/hideLoading',
      payload
    });

    router.push('/newCard/showId');
  }

  render() {
    return (
      <div className={styles.home}>
        <Step />
        <div className={styles.figure}>
          { !this.hasInserted ? <CountDown text="请于%s内插入您的身份证" num={60} onEnd={this.onTimeout} /> : null }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Page);
