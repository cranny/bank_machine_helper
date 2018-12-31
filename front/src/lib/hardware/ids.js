import { BaseAPI } from './base'
import { Log, LogAsync } from '../decorators'

const debug = require('debug')('wb:lib:hardware:ids')

export class Ids extends BaseAPI {
  debug = debug

  static DEVICE_NAME = '二代证读卡器'

  static EVENTS = {
    onInserted: {
      command: 'idsInsertAsyn',
      name: 'OnIdsInserted',
      desc: 'event: 二代证已放入'
    },

    onRead: {
      command: 'idsReadAsyn',
      name: 'OnIdsRead',
      desc: 'event: 二代证已读取'
    },

    onScan: {
      command: 'idsReadAsyn',
      name: 'OnIdsRead',
      desc: 'event: 二代证已扫描'
    }
  }

  isActive() {
    return this.ctx.IdsActive
  }

  @Log('打开')
  open() {
    return this.ctx.idsOpen(0)
  }

  @Log('获取设备状态')
  getInfo(type = 11) {
    return  this.ctx.idsGetInfo(type)
  }

  @Log('复位')
  reset() {
    return this.ctx.idsReset()
  }

  openAndCheck() {
    this.open()
    const resCode = this.getInfo()
    // 设备未准备好便复位
    if (resCode === 3) {
      this.reset()
    }
  }

  @Log('关闭')
  close() {
    return this.ctx.idsClose()
  }

  @LogAsync('等待插入')
  insert(timeout = 30 * 1000) {
    return this.ctx.idsInsertAsyn(timeout)
  }

  @Log('取消等待插入')
  cancelInsert() {
    return this.ctx.idsCancel()
  }

  @LogAsync('开始读取')
  read() {
    return this.ctx.idsReadAsyn(1, 0)
  }

  @LogAsync('开始扫描')
  scan() {
    return this.ctx.idsReadAsyn(2, 0)
  }

  static getReadResult(eventResult) {
    if (!eventResult) {
      throw new Error('eventResult should not be empty')
    }

    return {
      code: eventResult.SF,
      name: eventResult.NM,
      sex: eventResult.SX,
      nation: eventResult.MZ,
      birthday: eventResult.BD,
      address: eventResult.AD,
      issueAgency: eventResult.QF,
      issueDate: eventResult.SD,
      expiredDate: eventResult.ED,
      avatar: `file://C:\\ZZAgent\\Picture.jpg`
    }
  }

  static isReadResult(eventResult) {
    return eventResult && eventResult.QF
  }

  static getScanResult(eventResult) {
    if (!eventResult) {
      throw new Error('getScanResult: eventResult should not be empty')
    }

    const rsCode = parseInt(eventResult.RT, 10)

    if (rsCode === 9) {
      throw new Error('getScanResult: not supported')
    }

    if (rsCode === 1) {
      throw new Error('getScanResult: failed')
    }

    if (rsCode !== 0) {
      throw new Error('getScanResult: unknown error')
    }

    return {
      IdsImage1: `file://C:\\ZZAgent\\IdCardPic\\Image-0.jpg`,
      IdsImage2: `file://C:\\ZZAgent\\IdCardPic\\Image-1.jpg`
    }
  }
}
