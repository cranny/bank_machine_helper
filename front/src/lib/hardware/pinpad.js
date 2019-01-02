import { BaseAPI } from './base'
import { Log, LogAsync } from '../decorators'

const debug = require('debug')('wb:lib:hardware:pinpad')

export class Pinpad extends BaseAPI {
  debug = debug

  static DEVICE_NAME = '密码键盘'

  static EVENTS = {
    OnInput: {
      name: 'OnPinPadKeyPressed',
      desc: 'event: 密码键已按下'
    }
  }

  isActive() {
    return this.ctx.PinPadActive
  }

  @Log('打开')
  open() {
    return this.ctx.pinpadOpen(0)
  }

  @Log('关闭')
  close() {
    return this.ctx.pinpadClose()
  }

  @LogAsync('获取数据')
  getData(cardNum) {
    return this.ctx.pinpadGetDataAsyn(cardNum)
  }

  start() {
    this.open()
    this.pinpadBeginRead()
  }

  @Log('等待输入')
  pinpadBeginRead(timeout, mode = 1, maxLength = 6) {
    return this.ctx.pinpadBeginRead(timeout, mode, maxLength)
  }

  @Log('结束等待输入')
  pinpadEndRead() {
    return this.ctx.pinpadEndRead(1)
  }
}
