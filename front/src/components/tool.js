/**@fileoverview 调试用 */

import styles from './tool.scss';
import { Button } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import { getBankAPI } from '../lib/bankApi'
import idsPic from '../assets/new_card/ids.jpg'

const debug = require('debug')('wb:components:tool')

function Tool({ show }) {
  const putIds = () => {
    debug('触发放身份证事件')
    getBankAPI().Ids.emit('onInserted')
  }

  const idsReadDone = () => {
    debug('触发读取完毕事件')
    getBankAPI().Ids.emit('onRead', {
      province: '地球',
      name: '卡卡罗特',
      sex: '男',
      nation: '赛亚',
      birthday: '1978-01-01',
      address: '大山',
      issueAgency: '地球英雄联盟',
      issueDate: '1978-01-18',
      expiredDate: '2978-01-01'
    })
  }

  const idsScanDone = () => {
    debug('触发扫描完毕事件')
    getBankAPI().Ids.emit('onScan', {
      IdsImage1: idsPic,
      IdsImage2: idsPic
    })
  }

  const pinPadInput = () => {

  }

  return (
    <div className={classNames(styles.tool, show ? '' : 'hide')}>
      <Button type="primary" onClick={putIds}>放身份证</Button>
      <hr />
      <Button type="primary" onClick={idsReadDone}>身份证读取完毕</Button>
      <hr />
      <Button type="primary" onClick={idsScanDone}>身份证扫描完毕</Button>
      <hr />
      <Button type="primary" onClick={pinPadInput}>按密码键</Button>
      <hr />
    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Tool);
