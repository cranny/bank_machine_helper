import styles from './checkId.css';
// import { Row, Col } from 'antd';
// import classNames from 'classnames';
import router from 'umi/router';
import { connect } from 'dva';

function next() {
  router.push('/newCard/showId');
}

function Page({ app, dispatch }) {
  setTimeout(() => {
    dispatch({
        type: 'app/showLoading',
        payload: {
          text: '正在读取身份证信息',
        },
      });
  }, 500)
  setTimeout(() => {
    dispatch({
      type: 'app/hideLoading',
    });
  }, 3000);

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

function mapStateToProps(state) {
  return {
    app: state.app,
  };
}

export default connect(mapStateToProps)(Page);
