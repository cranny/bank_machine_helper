import EventEmitter from 'eventemitter3'
import { Log, LogAsync } from '../decorators'

const debug = require('debug')('wb:lib:hardware:pinpad')

export class Pinpad extends EventEmitter {
  constructor(ctx) {
    super()
    this.ctx = ctx
    return this
  }

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

  getData(cardNum) {
    debug('密码盘获取输入', cardNum)
    return this.ctx.pinpadGetData(cardNum)
  }

  pinpadMainKey(key) {
    debug('密码盘加载主密钥', key)
    return this.ctx.pinpadMainKey(key)
  }

  pinpadWorkKey(key) {
    debug('密码盘加载工作密钥', key)
    return this.ctx.pinpadWorkKey(key)
  }

  pinpadBeginRead(timeout, mode, maxLength = 6) {
    debug('密码盘等待输入')
    this.ctx.pinpadBeginRead(timeout, mode, maxLength)
  }

  pinpadEndRead() {
    debug('密码盘结束等待输入')
    this.ctx.pinpadEndRead()
  }
}
