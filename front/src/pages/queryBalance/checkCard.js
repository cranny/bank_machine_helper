import styles from './checkCard.scss';
import { Button } from 'antd';
import classNames from 'classnames';
import router from 'umi/router';
import { connect } from 'dva';
import { getBankAPI } from '../../lib/hardware';
import React from 'react';
import CountDown from '../../components/countdown'
// import Step from '../../components/step'

const debug = require('debug')('wb:pages:checkId')

class Page extends React.Component {

  hasInserted = false
  timeout = 999

  componentDidMount() {
    getBankAPI().ContactlessCard.start()

    // this.onIn()

    getBankAPI().ContactlessCard.once('onIn', this.onIn)
    getBankAPI().ContactlessCard.once('onOut', this.onOut)

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

  onIn = async () => {
    this.hasInserted = true
    debug('接收到银行卡已放置事件')
    this.props.dispatch({
      type: 'app/showLoading',
      payload: {
        loading: '正在读取银行卡信息',
      },
    });

    const cardData = await getBankAPI().ContactlessCard.afterIn()
    console.log(cardData)

    this.props.dispatch({
      type: 'card/onRead',
      payload: cardData
    });

    this.props.dispatch({
      type: 'app/hideLoading'
    });
  }

  onOut = async () => {
    debug('接收到银行卡已取走事件')
    await getBankAPI().ContactlessCard.afterOut()
  }

  onConfirm = () => {

  }

  renderCardResult() {
    const { id } = this.props.card
    return (
      <div>
       您的卡号为: {id}
      <Button value="确认" type="primary" size="large" onClick={this.onConfirm} className={classNames(styles.button, 'wb-button')} />
      </div>
    )
  }

  renderWait() {
    return (
      <div className={styles.figure}>
      { !this.hasInserted ? <CountDown text="请于%s内放置您的银行卡到指定区域" num={this.timeout} onEnd={this.onTimeout} /> : null }
      </div>
    )
  }

  render() {
    const { id } = this.props.card
    return (
      <div className={styles.home}>
        {/* <Step /> */}
        { id ? this.renderCardResult() : this.renderWait() }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    card: state.card
  };
}

export default connect(mapStateToProps)(Page);
