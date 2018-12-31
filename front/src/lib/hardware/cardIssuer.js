import { BaseAPI } from './base'
import { Log, LogAsync } from '../decorators'

const debug = require('debug')('wb:lib:hardware:cardIssuer')

export class CardIssuer extends BaseAPI {
  debug = debug

  static DEVICE_NAME = '发卡器'

  static EVENTS = {
    onSwallow: {
      command: 'cardissuerRetainAsyn',
      name: 'OnCardissuerRetained',
      desc: 'event: 发卡器已吞卡'
    },

    onIssue: {
      command: 'cardissuerInsertEx',
      name: 'OnCardissuerInserted',
      desc: 'event: 发卡器已发卡'
    },

    onSplit: {
      command: 'cardissuerEjectAsyn',
      name: 'OnCardissuerCardTaken',
      desc: 'event: 发卡器已吐卡'
    }
  }

  // 最近一次用户插入的卡号
  get lastCardNum() {
    return this.ctx.CardissuerCardNumber
  }

  // 是否安装了发卡器
  get isActive() {
    return this.ctx.CardissuerActive
  }

  // 	0=成功，-2=设备硬件故障，-6=操作超时。
  @Log('打开')
  open() {
    return this.ctx.cardissuerOpen(1, 1)
  }

  @Log('关闭')
  close() {
    return this.ctx.cardissuerClose()
  }

  toReadMode() {
    this.ctx.SetWorkMode(0)
  }

  // type 1 是否允许插卡,  0 不允许 1 允许
  // type 2 初始化时对卡的处理 0 吞卡 1 退卡 2 无动作
  @Log('设置参数化')
  setParam(type, param1) {
    return this.ctx.cardissuerSetParam(type, param1)
  }

  // 0=成功，-1=设备没有打开，-2=硬件故障，-6=操作超时
  @Log('强制初始化')
  forceInit() {
    return this.ctx.cardissuerInit()
  }

  // RT 0=成功，-1=设备没有打开，-2=硬件故障，-6=操作超时
  @Log('获取设备状态')
  getDeviceInfo() {
    return this.ctx.cardissuerGetInfo(21)
  }

  @Log('获取卡箱数据')
  getBoxData() {
    return this.ctx.cardissuerGetInfo(22)
  }

  @Log('获取卡箱数量')
  getBoxCount() {
    return this.ctx.cardissuerGetCUCount()
  }

  @LogAsync('发卡')
  issue(boxId) {
    return this.ctx.cardissuerInsertEx(0, boxId)
  }

  @Log('取消发卡')
  cancelIssue() {
    return this.ctx.cardissuerCancel()
  }

  @LogAsync('读卡')
  read() {
    return this.ctx.cardissuerReadAsyn(7)
  }

  @LogAsync('吞卡')
  swallow() {
    return this.ctx.cardissuerRetainAsyn('6222688888888888888888')
  }

  @LogAsync('吐卡')
  split() {
    return this.ctx.cardissuerEjectAsyn(0, '')
  }

  // 1 无动作 2 退出卡片 3 回收卡片
  @Log('复位')
  reset(actionKey, timeout) {
    return this.ctx.cardissuerResetAsyn(actionKey, timeout)
  }

  @LogAsync('上电')
  powerOn() {
    return this.ctx.cardissuerICPowerOnAsyn()
  }

  @LogAsync('下电')
  powerOff() {
    return this.ctx.cardissuerICPowerOffAsyn()
  }
}
