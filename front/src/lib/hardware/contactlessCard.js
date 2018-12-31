import EventEmitter from 'eventemitter3'
import { Log, LogAsync } from '../decorators'
import {parseAsyncResult, OcxExceptions, handleSyncResult, parseSpecialFormat} from '../utils'

const debug = require('debug')('wb:lib:hardware:contactlessCard')

export class ContactlessCard extends EventEmitter {
  constructor(ctx) {
    super()
    this.ctx = ctx
    return this
  }

  debug = debug

  static DEVICE_NAME = '非接读卡器'

  static EVENTS = {
    onIn: {
      name: 'OnContactlessCardIn',
      desc: 'event: 银行卡已放置'
    },

    onOut: {
      name: 'OnContactlessCardTaken',
      desc: 'event: 银行卡已取走'
    },

    onBuildApply: {
      command: 'isBuildApply',
      name: 'OnContactlessCardGetPSEAID',
      desc: 'event: 应用列表已建立'
    },

    onChoiceApply: {
      name: 'OnContactlessCardSelectADF',
      desc: 'event: 已选择应用'
    },

    onReadCardValidity: {
      name: 'OnContactlessCardCardDateInfo',
      desc: 'event: 已读有效日期'
    },

    onReadTrack2: {
      name: 'OnContactlessCardPBOCGetTrack2Data',
      desc: 'event: 已读二磁道数据'
    },

    onInitializeCircle: {
      name: 'OnContactlessCardInitForLoad',
      desc: 'event: 已读初始化圈存,圈提'
    },

    onReadField55: {
      name: 'OnContactlessCardReadIcTLV',
      desc: 'event: 已读初始化圈存,圈提'
    }
  }

  // 最近一次用户插入的卡号
  get lastCardNum() {
    return this.ctx.ContactlessCardNumber
  }

  // 是否安装了发卡器
  get isActive() {
    return this.ctx.ContactlessCardActive
  }

  // 	0=成功，-2=设备硬件故障，-6=操作超时。
  @Log('打开')
  open() {
    return this.ctx.contactlessCardOpen(0)
  }

  @Log('关闭')
  close() {
    return this.ctx.contactlessCardClose()
  }

  // 0=成功，-1=设备没有打开，-2=硬件故障，-6=操作超时
  @Log('初始化')
  forceInit() {
    return this.ctx.contactlessCardInit()
  }

  // ^RTxx^WPxx^LPxx
  // 0=正常，1=故障
  @Log('设备状态')
  getInfo() {
    return this.ctx.contactlessCardGetInfo(11)
  }

  openAndCheck() {
    this.open()
    const infoData = this.getInfo()
    if (!infoData.isOK) {
      this.reset()
    }
  }

  @LogAsync('等待放置')
  insert(timeout = 60) {
    return this.ctx.contactlessCardInsert(timeout)
  }

  @Log('取消等待放置')
  cancelInsert() {
    return this.ctx.contactlessCardCancel()
  }

  @LogAsync('复位')
  reset(timeout = 6000) {
    return this.ctx.contactlessCardReset(timeout)
  }

  @LogAsync('退卡')
  taken(timeout = 30) {
    return this.ctx.contactlessCardEjectAsyn(timeout)
  }

  @Log('上电')
  powerOn() {
    return this.ctx.contactlessCardPowerOn()
  }

  @Log('下电')
  powerOff() {
    return this.ctx.contactlessCardPowerOff()
  }

  @Log('建立应用列表')
  buildApply() {
    return this.ctx.contactlessCardGetPSEAIDAsyn('')
  }

  @Log('应用选择')
  choiceApply(aIn) {
    return this.ctx.contactlessCardSelectADFAsyn(aIn)
  }

  /*@Log('应用初始化')
  initializeApply() {
    return this.ctx.contactlessCardGetProOptionAsyn(0,30)
  }

  @Log('读应用数据')
  readApplyData(aAFL) {
    return this.ctx.contactlessCardReadAppDataAsyn(aAFL)
  }*/

  @Log('读有效日期')
  readCardValidity() {
    return this.ctx.contactlessCardCardDateInfoAsyn()
  }

  @Log('读二磁道')
  readTrack2() {
    return this.ctx.contactlessCardPBOCGetTrack2DataAsyn()
  }

  @Log('圈存,圈提初始化')
  initializeCircle() {
    return this.ctx.contactlessCardInitForLoadAsyn()
  }

  @Log('读55域数据')
  readField55() {
    return this.ctx.contactlessCardReadIcTLVAsyn()
  }

  @Log('读卡序列号')
  read5F34(aTag) {
    const resCode = this.ctx.contactlessCardGetTag(aTag)
    handleSyncResult('读卡序列号', resCode.RT)
  }

  static isBuildApplyResult(eventResult) {
    if (!eventResult) {
      throw new Error('eventResult should not be empty')
    }

    return {
      aIn: eventResult.AD.split('|')[0]
    }
  }
}
