import styles from './checkId.css';
// import { Row, Col } from 'antd';
// import classNames from 'classnames';
import router from 'umi/router';
import { connect } from 'dva';
import { getBankAPI } from '../../lib/bankApi'

const debug = require('debug')('wb:pages:checkId')

function next() {
  router.push('/newCard/showId');
}

function Page({ dispatch }) {
  getBankAPI().Ids.open()
  getBankAPI().Ids.insert()

  getBankAPI().Ids.once('onInserted', () => {
    debug('接收到身份证已放置事件')
    getBankAPI().Ids.read()
    dispatch({
      type: 'app/showLoading',
      payload: {
        loading: '正在读取身份证信息',
      },
    });
  })

  getBankAPI().Ids.once('onRead', (payload) => {
    debug('接收到身份证已读取事件', payload)
    dispatch({
      type: 'app/hideLoading',
      payload
    });
  })

  return (
    <div className={styles.home}>
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
      <div onClick={next} className={styles.figure} />
    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Page);
