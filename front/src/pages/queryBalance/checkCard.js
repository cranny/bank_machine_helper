import styles from './checkCard.scss';
// import { Row, Col } from 'antd';
// import classNames from 'classnames';
import router from 'umi/router';
import { connect } from 'dva';
import { getBankAPI } from '../../lib/bankApi';
import React from 'react';
import CountDown from '../../components/countdown'
import Step from '../../components/step'

const debug = require('debug')('wb:pages:checkId')

class Page extends React.Component {

  hasInserted = false
  timeout = 30

  componentDidMount() {
    getBankAPI().ContactlessCard.openAndCheck()
    getBankAPI().ContactlessCard.insert(this.timeout)

    getBankAPI().ContactlessCard.once('onIn', this.onIn)
    getBankAPI().ContactlessCard.once('onOut', this.onOut)
    // getBankAPI().Ids.once('onRead', this.onRead)
  }

  onTimeout = () => {
    getBankAPI().ContactlessCard.cancelInsert()
    getBankAPI().ContactlessCard.close()
    router.push('/');
  }

  componentWillUnmount() {
    getBankAPI().ContactlessCard.off('onIn', this.onIn)
    getBankAPI().ContactlessCard.off('onOut', this.onOut)

    !this.hasInserted && getBankAPI().ContactlessCard.cancelInsert()
    getBankAPI().ContactlessCard.close()
  }

  onIn = () => {
    this.hasInserted = true
    debug('接收到银行卡已放置事件')
    // getBankAPI().ContactlessCard.read()
    this.props.dispatch({
      type: 'app/showLoading',
      payload: {
        loading: '正在读取银行卡信息',
      },
    });
  }

  onOut = () => {

  }

  onRead = payload =>{
    debug('接收到银行卡已读取事件', payload)
    // this.props.dispatch({
    //   type: 'ids/onRead',
    //   payload: payload.value
    // });
    // this.props.dispatch({
    //   type: 'app/showLoading',
    //   payload: {
    //     loading: '正在扫描身份证信息',
    //   }
    // });
  }

  render() {
    return (
      <div className={styles.home}>
        <Step />
        <div className={styles.figure}>
          { !this.hasInserted ? <CountDown text="请于%s内放置您的银行卡到指定区域" num={this.timeout} onEnd={this.onTimeout} /> : null }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Page);
