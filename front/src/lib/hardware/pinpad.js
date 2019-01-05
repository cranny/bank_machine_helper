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
    },
    onBeginRead: {
      command: 'pinpadBeginReadAsyn',
      name: 'OnPinpadBeginRead',
      desc: 'event: 已输入密码'
    },
    onGetData: {
      command: 'pinpadGetDataAsyn',
      name: 'OnPinpadGottenData',
      desc: 'event: 已取得密码'
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

  async start() {
    this.open()
    this.pinpadBeginRead()
    for (const i of [1,2,3,4,5,6]) {
      await this.waitEvent('OnInput')
    }
    //this.getData(cardNum)

    //const result = await this.waitEvent('onGetData')
    //return result
  }

  async loadData(cardNum){
    console.log("cardNum" + cardNum)
    this.getData(cardNum)

    const result = await this.waitEvent('onGetData')
    console.log("result" + result)
    return result
  }

  @Log('MAC加密')
  pinpadGetMacHex(mac64) {
    return this.ctx.pinpadGetMacHex(mac64, 1)
  }

  @Log('二磁道加密')
  pinpadCrypt(track2Key) {
    return this.ctx.pinpadCrypt(1, 0, "CryptKey", track2Key)
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
