import styles from './result.scss';
import classNames from 'classnames';
// import Link from 'umi/link';
import router from 'umi/router';
import { Alert } from 'antd';
import React from 'react';
import { connect } from 'dva';
// import { getBankAPI } from '../../lib/hardware';
// import { postman } from '../../lib/ajax'
// import CountDown from '../../components/countdown'

class Page extends React.Component {
  componentDidMount() {
    console.log(this.props.allState)
  }

  componentWillUnmount() {

  }

  renderForm() {
    return (
      <div className={styles.result}>
        <Alert
          message="查询成功"
          description=""
          type="success"
          showIcon
        />

        <table>
          <tbody>
          <tr><td>余额: </td><td>17150.00</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderForm()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    allState: state
  }
}

export default connect(mapStateToProps)(Page);
