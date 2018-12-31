import styles from './checkCard.scss';
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
  timeout = 999

  componentDidMount() {
    getBankAPI().ContactlessCard.start(this.timeout)

    this.onIn()

    getBankAPI().ContactlessCard.once('onIn', this.onIn)
    getBankAPI().ContactlessCard.once('onOut', this.onOut)
    getBankAPI().ContactlessCard.once('onBuildApply', this.onBuildApply)
    getBankAPI().ContactlessCard.once('onChoiceApply', this.onChoiceApply)
    getBankAPI().ContactlessCard.once('onReadCardValidity', this.onReadCardValidity)
    getBankAPI().ContactlessCard.once('onReadTrack2', this.onReadTrack2)
    getBankAPI().ContactlessCard.once('onInitializeCircle', this.onInitializeCircle)
    getBankAPI().ContactlessCard.once('onReadField55', this.onReadField55)

    //getBankAPI().Ids.once('onRead', this.onRead)
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
    this.props.dispatch({
      type: 'app/showLoading',
      payload: {
        loading: '正在读取银行卡信息',
      },
    });

    getBankAPI().ContactlessCard.afterIn()
  }

  onOut = () => {

  }

  onBuildApply = () => {
    debug('接收到建立应用列表事件')

    getBankAPI().ContactlessCard.choiceApply('A000000333010101')
  }

  onChoiceApply = () => {
    debug('接收到应用选择事件')

    getBankAPI().ContactlessCard.readCardValidity()
  }

  onReadCardValidity = () => {
    debug('接收到读卡有效日期事件')

    getBankAPI().ContactlessCard.readTrack2()
  }

  onReadTrack2 = () => {
    debug('接收到读二磁道数据事件')

    getBankAPI().ContactlessCard.initializeCircle()
  }

  onInitializeCircle = () => {
    debug('接收到圈存,圈提初始化事件')

    getBankAPI().ContactlessCard.readField55()
  }

  onReadField55 = () => {
    debug('接收到读55域数据事件')

    const tag = '5F34'
    getBankAPI().ContactlessCard.read5F34(tag)
  }

  onRead = payload =>{
    debug('接收到银行卡已读取事件', payload)
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
